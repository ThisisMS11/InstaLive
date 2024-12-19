'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/imports/Shadcn_imports';
import { Image } from '@/imports/Nextjs_imports';
import { Plus, Ban } from 'lucide-react';
import { useRef } from 'react';
import { OverlayUploadDialog } from '@/imports/Component_imports';

export default function OverlayAccordion({
  setOverlayImage,
  overlays,
}: {
  setOverlayImage: (_url: string | undefined) => void;
  overlays: any;
}) {
  const buttonref = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className="w-[90%] m-4 ">
        <div>
          <div className="text-xl flex items-center justify-between">
            <h2>Overlays</h2>

            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Ban
                      onClick={() => {
                        setOverlayImage(undefined);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>None</p>
                  </TooltipContent>
                </Tooltip>
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
          </div>

          <div className="h-80 overflow-y-scroll">
            {overlays && overlays.length > 0 ? (
              overlays.map((overlay: any) => (
                <div
                  key={overlay.id}
                  className="dark:border-gray-700 flex my-2 border-2 border-gray-200  rounded-md h-20 items-center content-center gap-2 p-2"
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
              ))
            ) : (
              <div>No Overlays </div>
            )}
          </div>
        </div>

        <OverlayUploadDialog buttonRef={buttonref} />
      </div>
    </>
  );
}
