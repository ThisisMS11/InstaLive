'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';

export default function Navbar({ className }: { className?: string }) {
  const session = useSession();

  return (
    <div
      className={cn('fixed top-5 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <nav className="border-2 border-gray-200 flex items-center justify-between p-4 rounded-full">
        {/* @ts-ignore */}
        <Image src={logo} width={40} height={40} />

        {/* @ts-ignore */}
        {session?.data?.user && (
          // @ts-ignore
          <Image
            src={session?.data?.user.image}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </nav>
    </div>
  );
}
