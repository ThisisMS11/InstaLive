'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"

const overlays = [
    {
        src: 'https://res.cloudinary.com/cloudinarymohit/image/upload/v1719056692/bg1_pycpon.png',
        description: "Background-1 Overlay"
    },
    {
        src: 'https://res.cloudinary.com/cloudinarymohit/image/upload/v1719056563/bg2_vqcptj.png',
        description: "Background-2 Overlay"
    }
]

export default function OverlayAccordion({ setOverlayImage }: { setOverlayImage: (url: string) => void }) {
    return (
        <Accordion type="single" collapsible className="w-full m-4">


            <AccordionItem value="item-1" >
                <AccordionTrigger>Overlays</AccordionTrigger>
                <AccordionContent>
                    {overlays.map((e, index) => (
                        <div key={index} className="flex my-2 border-2 border-black w-[90%] rounded-md h-20 items-center content-center gap-2 p-2">
                            <Image src={e.src} alt="Image Not found" className="w-10 h-10 rounded-sm border-black " width={10} height={10} />
                            <div className="w-full border-black h-full text-lg items-center justify-center flex cursor-pointer hover:text-gray-600" onClick={() => {setOverlayImage(e.src) }}>
                                {e.description}
                            </div>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}
