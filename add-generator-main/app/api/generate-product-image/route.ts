import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setDoc, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

const apiKey = process.env.GEMINI_KEY;
const clipdropKey = process.env.CLIPDROPAPI_KEY;

if (!apiKey || !clipdropKey) {
  throw new Error("Required API keys are missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

// UPDATED: Now requests both a static image prompt and a motion-heavy video prompt
const SYSTEM_PROMPT = `Analyze this product image. Your task is to generate two distinct prompts for a professional marketing showcase.
1. "imagePrompt": A vibrant, high-end text-to-image prompt for a static professional showcase.
2. "videoPrompt": A cinematic image-to-video motion prompt. Focus on slow camera movements (e.g., pan, tilt, or zoom-in), subtle subject actions (e.g., steam rising, light sweeping across the surface, or gentle rotation), and atmospheric effects.

Return ONLY a valid JSON object in this format: 
{"imagePrompt": "...", "videoPrompt": "..."}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData?.get('file') as File;
    const description = formData?.get('description') || "Professional product shot";
    const size = formData?.get('size');
    const userEmail = formData?.get('userEmail');

    // User lookup and credit check
    const userRef = collection(db, 'users');
    const q = query(userRef, where('userEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    const userInfo = userDoc?.data();

    // 1. Initial Firestore Log
    const docId = Date.now().toString();
    await setDoc(doc(db, 'users', docId), {
      userEmail: userEmail,
      status: 'pending',
      description: description,
      size: size
    });

    // 2. Prepare Image for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString('base64');

    // 3. Generate Prompts using Gemini (Gemini 2.5 Flash for multimodal speed)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent([
      { inlineData: { data: base64File, mimeType: file.type } },
      `${SYSTEM_PROMPT} \n Product Context: ${description}`
    ]);

    const json = JSON.parse(result.response.text());
    const refinedImagePrompt = json.imagePrompt;
    const refinedVideoPrompt = json.videoPrompt; // This is your new video prompt

    // 4. Generate Image using Clipdrop (Image Generation)
    const clipdropForm = new FormData();
    clipdropForm.append('prompt', refinedImagePrompt);

    const clipdropRes = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: { 'x-api-key': clipdropKey ?? "" },
      body: clipdropForm,
    });

    if (!clipdropRes.ok) {
      const errorData = await clipdropRes.json();
      throw new Error(`Clipdrop Error: ${errorData.error || clipdropRes.statusText}`);
    }

    const imageBuffer = await clipdropRes.arrayBuffer();
    const generatedBase64 = Buffer.from(imageBuffer).toString('base64');

    // 5. Upload to ImageKit
    const uploadedGenerated = await imagekit.upload({
      file: generatedBase64,
      fileName: `generated-${Date.now()}.png`,
    });

    // 6. Update Firestore with final data and deduct credits
    await updateDoc(doc(db, 'users', docId), {
      finalProductImageURL: uploadedGenerated?.url,
      status: 'completed',
      videoPrompt: refinedVideoPrompt, // Store the video prompt for later use
      creditsRemaining: (userInfo?.credits || 0) - 5
    });

    return NextResponse.json({
      imagePrompt: refinedImagePrompt,
      videoPrompt: refinedVideoPrompt,
      generatedImageUrl: uploadedGenerated?.url
    });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}