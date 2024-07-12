'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { useRouter, useSession, Image } from '@/imports/Nextjs_imports';
import logo from '@/app/assets/logo.png';

export default function Navbar({ className }: { className?: string }) {
  const session = useSession();
  const router = useRouter();

  return (
    <div
      className={cn('fixed top-5 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <nav className="border-2 border-gray-200 flex items-center justify-between p-2 rounded-full">
        {/* @ts-ignore */}
        <Image
          src={logo}
          alt="Logo"
          width={34}
          height={34}
          onClick={() => {
            router.push('/');
          }}
        />

        {/* @ts-ignore */}
        {session?.data?.user && (
          <Image
            // @ts-ignore
            src={session?.data?.user.image}
            alt="Profile Image"
            width={34}
            height={34}
            className="rounded-full"
          />
        )}
      </nav>
    </div>
  );
}
