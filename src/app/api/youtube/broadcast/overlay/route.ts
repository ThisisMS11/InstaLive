import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/api/utils/cloudinary';
import { addOverlay, GetOverlays } from '@/app/api/services/broadcasts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    const file = data.get('overlay') as File | null;
    const name = data.get('name') as string;
    const session = await getServerSession(authOptions);

    if (!file) {
      return NextResponse.json(
        { message: 'Please provide the image file to be uploaded' },
        { status: 400 }
      );
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return NextResponse.json(
        { message: 'Please upload an image file of type png or jpeg' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.v2.uploader.upload(
      `data:${file.type};base64,${buffer.toString('base64')}`,
      {
        folder: 'liveMe_Overlays',
      }
    );

    let { public_id, secure_url } = result;

    /* add an overlay */
    try {
      // @ts-ignore
      await addOverlay(session?.user.id, public_id, secure_url, name);
    } catch (error) {
      throw error;
    }

    const response = { public_id, url: secure_url };
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (err) {
    console.error('Error uploading file to Cloudinary:', err);
    return NextResponse.json(
      { message: 'Failed to upload image, please try again later' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('User session is not defined.');
  }

  try {
    const overlays = await GetOverlays(userId);
    return NextResponse.json({ data: overlays }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while fetching user overlays', error },
      { status: 401 }
    );
  }
};
