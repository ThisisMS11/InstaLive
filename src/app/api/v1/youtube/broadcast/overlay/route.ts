import { NextRequest } from 'next/server';
import cloudinary from '@/app/api/utils/cloudinary';
import { addOverlay, GetOverlays } from '@/app/api/services/broadcasts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('Broadcast_Overlay');

export const POST = async (req: NextRequest) => {
  try {
    logger.info('Uploading Custom Overlay ...');

    const data = await req.formData();
    const file = data.get('overlay') as File | null;
    const name = data.get('name') as string;
    const session = await getServerSession(authOptions);

    if (!file) {
      logger.error('Image File not provided');
      return makeResponse(
        400,
        false,
        'Please provide the image file to be uploaded',
        null
      );
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      logger.error('Image File format did not match png or jpeg');
      return makeResponse(
        400,
        false,
        'Please upload an image file of type png or jpeg',
        null
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
    return makeResponse(200, true, 'Overlay Successfully uploaded', response);
  } catch (error) {
    logger.error(`Error uploading file to Cloudinary `, error);
    return makeResponse(
      500,
      false,
      'Failed to upload image, please try again later',
      null
    );
  }
};

export const GET = async () => {
  logger.info(`Fetching User Overlays ..`);
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('User session is not defined.');
  }

  try {
    const overlays = await GetOverlays(userId);
    return makeResponse(200, true, 'Overlays Feteched', overlays);
  } catch (error) {
    logger.error(`Error Fetching User Overlays ..`, error);
    return makeResponse(401, false, 'Error while fetching user overlays', null);
  }
};
