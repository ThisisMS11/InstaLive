'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { useRouter, signIn, useSession, Image } from '@/imports/Nextjs_imports';
import { Avatar, AvatarFallback, AvatarImage } from '@/imports/Shadcn_imports';
import logo from '@/app/assets/logo.png';
import { Button } from '../ui/button';
import Logo from '../logo';

function IsLoggedIn({ imageUrl }: { imageUrl: String }) {
  return (
    <Avatar>
      {/* @ts-ignore  */}
      <AvatarImage src={imageUrl} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default function Navbar({ className }: { className?: string }) {
  const session = useSession();
  const router = useRouter();

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
              </div>
              {/* @ts-ignore  */}
              {session?.data?.user && <IsLoggedIn imageUrl={session.data.user.image} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
