'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { useRouter, useSession, Image } from '@/imports/Nextjs_imports';
import logo from '@/app/assets/logo.png';
import { Button } from '../ui/button';
import Logo from '../logo';

export default function Navbar({ className }: { className?: string }) {
  const session = useSession();
  const router = useRouter();

  return (
    <>
      <main className="max-w-6xl mt-3 mx-auto">
        <div className="p-4">
          <div className="flex bg-accent/50 backdrop-blur-2xl items-center justify-between px-4 py-2 rounded-xl">
            <Logo />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <span>Products</span>
                <span>Help</span>
                <span>Docs</span>
              </div>
              <Button>SignUp</Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
