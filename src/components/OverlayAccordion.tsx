'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/imports/Shadcn_imports';
import { Image } from '@/imports/Nextjs_imports';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import { OverlayUploadDialog, Loader } from '@/imports/Component_imports';
import { useOverlays } from '@/services/youtube'
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';

// const overlays = [
//   {
//     src: 'https://res.cloudinary.com/cloudinarymohit/image/upload/v1719056692/bg1_pycpon.png',
//     description: 'Background-1 Overlay',
//   },
//   {
//     src: 'https://res.cloudinary.com/cloudinarymohit/image/upload/v1719056563/bg2_vqcptj.png',
//     description: 'Background-2 Overlay',
//   },
// ];

export default function OverlayAccordion({
  setOverlayImage,
  overlays
}: {
  setOverlayImage: (_url: string) => void;
  overlays: any
}) {
  const buttonref = useRef<HTMLButtonElement | null>(null);

  console.log('overlays', overlays);

  return (
    <>
      <div className="w-[90%] m-4 ">

        <div>
          <div className="text-xl flex items-center justify-between">
            <h2>Overlays</h2>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Plus
                    onClick={() => {
                      buttonref.current?.click();
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a Custom Overlay</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            {overlays.length > 0 ? overlays.map((overlay: any) => (
              <div
                key={overlay.id}
                className="flex my-2 border-2 border-gray-200  rounded-md h-20 items-center content-center gap-2 p-2"
              >
                <Image
                  src={overlay.url}
                  alt="Image Not found"
                  className="w-10 h-10 rounded-sm border-black "
                  width={10}
                  height={10}
                />
                <div
                  className="w-full border-black h-full text-md items-center justify-center flex cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    setOverlayImage(overlay.url);
                  }}
                >
                  {overlay.description}
                </div>
              </div>
            )) : <div>No Overlays </div>}
          </div>
        </div>

        <OverlayUploadDialog buttonRef={buttonref} />
      </div>
    </>
  );
}
