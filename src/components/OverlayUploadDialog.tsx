import React, { useState, useRef } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  Input,
} from '@/imports/Shadcn_imports';

import {
  FilePond,
  registerPlugin,
  Orientation,
  Preview,
} from '@/imports/Specific_imports';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { uploadCustomOverlay } from '@/services/youtube';

registerPlugin(Orientation, Preview);

const OverlayUploadDialog = ({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const [files, setFiles] = useState<any | null>(null);
  const [overlayName, setOverlayName] = useState<string>('Default Description');
  const overlayForm = new FormData();
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isLoading, setisLoading] = useState<any | null>(null);
  // let flag = false;

  const handleFileUpload = async () => {
    setisLoading(true);

    if (files) {
      /* for images seperation */
      files.forEach((file: any) => {
        file = file.source;
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          overlayForm.append('overlay', file);
        }
      });
      overlayForm.append('name', overlayName);
    }

    try {
      await uploadCustomOverlay(overlayForm);
      // @ts-ignore
      // const { url, public_id } = response.data.data;

      if (closeDialogButtonRef) closeDialogButtonRef.current?.click();

      toast('Success', {
        description: 'Overlay Successfully Uploaded',
        duration: 3000,
      });
    } catch (error) {
      console.log('something went wrong while uploading overlay image', error);
      toast('Error', {
        description:
          'Some error occured while uploading overlay image . Try Again.',
        duration: 5000,
        icon: <ShieldAlert color="#ba2c2c" />,
      });
    }

    setisLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" ref={buttonRef} className="hidden">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <Card className="m-2">
          <CardHeader>
            <CardTitle className="text-center">
              Upload an Overlay Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Name Your Overlay..."
              value={overlayName}
              onChange={(e) => setOverlayName(e.target.value)}
            />
            <FilePond
              files={files as any}
              onupdatefiles={setFiles}
              allowMultiple={false}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
          </CardContent>
          <CardFooter>
            {isLoading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={handleFileUpload} className="w-full">
                Upload File
              </Button>
            )}
          </CardFooter>

          <DialogClose asChild className="hidden">
            <Button
              type="button"
              variant="secondary"
              ref={closeDialogButtonRef}
            >
              Close
            </Button>
          </DialogClose>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OverlayUploadDialog;
