'use client';
import React from 'react';
import { useSession } from '@/imports/Nextjs_imports';
import { Avatar, AvatarFallback, AvatarImage } from '@/imports/Shadcn_imports';
import Logo from '../logo';
import ToggleButton from '@/components/ToggleButton';

function IsLoggedIn({ imageUrl }: { imageUrl: string | null | undefined }) {
    return (
        <Avatar>
            {/* @ts-ignore  */}
            <AvatarImage src={imageUrl} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
}

export default function Navbar() {
    const session = useSession();

    return (
        <>
            <main className="max-w-6xl mt-3 mx-auto">
                <div className="p-4 ">
                    <div className="flex bg-accent/50 backdrop-blur-2xl items-center justify-between p-3 rounded-xl">
                        <Logo />
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 text-sm">
                                <span>Products</span>
                                <span>Help</span>
                                <span>Docs</span>
                                <ToggleButton/>
                            </div>
                            {session?.data?.user && (
                                <IsLoggedIn
                                    imageUrl={session.data.user.image}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
