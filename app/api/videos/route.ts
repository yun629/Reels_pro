// import { authOptions } from "@/lib/auth";
// import { connectToDatabase } from "@/lib/db";
// import Video, { IVideo } from "@/models/Video";
// import { getServerSession } from "next-auth/next";

// import { NextRequest, NextResponse } from "next/server";


//   export async function GET(){
//     try{
//         await connectToDatabase();
//         const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
//         if(!videos || videos.length === 0){
//             return NextResponse.json([],{status:200});
//         }

//         return NextResponse.json(videos,{status:201});
//     }catch(err){
//         return NextResponse.json(
//             {error:"Failed to fetch videos"},
//             {status:500}
//         )
//     }
//   }

//   export async function POST(request:NextRequest){
//     try{
//         const session =await getServerSession(authOptions);
//         if(!session){
//             return NextResponse.json(
//                 {error:"Unauthorized"},
//                 {status:401}
//             )
//         }

//         await connectToDatabase();
//         const body:IVideo = await request.json();
//         if(!body.title || !body.description || !body.videoUrl || !body.thumbnailURL){
//             return NextResponse.json(
//                 {error:"All fields are required"},
//                 {status:400}
//             )
//         }

//         const videoData={
//             ...body,
//             controls:body.controls ?? true,
//             transformation:{
//                 height:1920,
//                 width:1080,
//                 quality:body.transformation?.quality??100
//             }
//         }

//         const newVideo=await Video.create(videoData);
//         return NextResponse.json(newVideo,{status:201});

//     }catch(err){
//         return NextResponse.json(
//             {error:"Failed to create video"},
//             {status:500}
//         )
//     }
//   }

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET /api/videos
export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos ?? [], { status: 200 });
  } catch (err) {
    console.error("GET /videos error:", err);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST /api/videos
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    const requiredFields = ['title', 'description', 'videoUrl', 'thumbnailURL'];
    const missing = requiredFields.filter((key) => !(body as any)[key]);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (err) {
    console.error("POST /videos error:", err);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
