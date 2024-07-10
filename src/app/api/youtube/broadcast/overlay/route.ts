import { NextRequest, NextResponse } from "next/server";
import cloudinary from '@/app/api/utils/cloudinary'

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.formData();
        const file = data.get("overlay") as File | null;

        if (!file) {
            return NextResponse.json({ message: "Please provide the image file to be uploaded" }, { status: 400 });
        }

        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            return NextResponse.json({ message: "Please upload an image file of type png or jpeg" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await cloudinary.v2.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
            folder: 'liveMe_Overlays'
        });

        const response = { public_id: result.public_id, url: result.secure_url };
        return NextResponse.json({ data: response }, { status: 200 });
    } catch (err) {
        console.error("Error uploading file to Cloudinary:", err);
        return NextResponse.json({ message: "Failed to upload image, please try again later" }, { status: 500 });
    }
};
