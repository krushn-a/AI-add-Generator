import { useAuthContext } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Download, Ghost, Loader2Icon, Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type PreviewProduct = {
    id: string,
    finalProductImageURL: string,
    description: string,
    size: string,
    status: string
}

function PreviewResult(){

    const {user} = useAuthContext();
    const [productList, setProductList] = useState<PreviewProduct[]>();

    useEffect(()=>{
        if(!user?.email) return;

        const q = query(collection(db,"users"),
        where('userEmail','==', user?.email))

        const unSub = onSnapshot(q,(querysnapshot)=>{
            const matchedDocs: any = [];
            querysnapshot.forEach((doc)=>{
                matchedDocs.push({id:doc.id, ...doc.data()});
            })
            console.log(matchedDocs)
            setProductList(matchedDocs);
        })

        return ()=>unSub();

    },[user?.email])


    const DownloadImage = async(ImageUrl:string)=>{
        const result = await fetch(ImageUrl);
        const blob = await result.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href=blobUrl;

        a.setAttribute('download','saaru');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    }

    return(
        <div className="p-5 rounded-2xl border">
            <h2 className="font-bold text-2xl">Generated Result</h2>
            <div className="grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {productList?.map((product,index)=>(
                    <div key={index}>

                        {product?.status == 'completed'?
                        <div>
                        <Image src={product?.finalProductImageURL} alt={product?.id}
                        width={500} height={500}
                        className="w-full h-[250px] object-cover rounded-lg"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                                <Button variant={'ghost'} onClick={()=>DownloadImage(product.finalProductImageURL)}> <Download/> </Button>
                                <Link href={product.finalProductImageURL} target='_blank'>
                                    <Button variant={'ghost'}> View </Button>
                                </Link>
                            </div>
                            <Button> <Sparkle/> Animate </Button>
                        </div>
                        </div>
                        :<div className="flex flex-col items-center justify-center border rounded-xl h-full max-h-[250px] bg-zinc-800">
                            <Loader2Icon className="animate-spin"/>
                            <h2>Generating...</h2>    
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviewResult