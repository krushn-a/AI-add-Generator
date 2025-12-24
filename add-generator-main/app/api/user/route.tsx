import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, addDoc, getDoc } from "firebase/firestore";
import { db } from '@/configs/firebaseConfig'; // Firebase
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
    const { userEmail, userName } = await req.json();

    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const docRef = await addDoc(usersRef, {
                name: userName,
                email: userEmail,
                credits: 0,
            });
            
            const newDoc = await getDoc(docRef);
            return NextResponse.json(newDoc.data());
        }
        
        return NextResponse.json(querySnapshot.docs[0].data());
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}