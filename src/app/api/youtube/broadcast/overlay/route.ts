import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/api/utils/cloudinary';
import { addOverlay, GetOverlays } from '@/app/api/services/broadcasts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLoggerWithLabel } from '@/app/api/utils/logger'

const logger = createLoggerWithLabel('Broadcast_Overlay')

export const POST = async (req: NextRequest) => {
  try {
    logger.info('Uploading Custom Overlay ...')

    const data = await req.formData();
    const file = data.get('overlay') as File | null;
    const name = data.get('name') as string;
    const session = await getServerSession(authOptions);

    if (!file) {
      logger.error('Image File not provided')
      return NextResponse.json(
        { message: 'Please provide the image file to be uploaded' },
        { status: 400 }
      );
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      logger.error('Image File format did not match png or jpeg')
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
      logger.info(`Saving ${name} to Db.`);
      // @ts-ignore
      await addOverlay(session?.user.id, public_id, secure_url, name);
    } catch (error) {
      logger.info(`Error Saving ${name} to Db : ${error}`);
      throw error;
    }

    const response = { public_id, url: secure_url };
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    logger.error(`Error uploading file to Cloudinary: ${error}`)
    return NextResponse.json(
      { message: 'Failed to upload image, please try again later' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  logger.info(`Fetching User Overlays ..`)
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
    logger.error(`Error Fetching User Overlays .. ${error}`)
    return NextResponse.json(
      { message: 'Error while fetching user overlays', error },
      { status: 401 }
    );
  }
};
