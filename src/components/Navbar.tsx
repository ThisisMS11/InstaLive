// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { useSession, signIn } from "next-auth/react"
// import Image from "next/image"
// import Rocker from '@/app/assets/rocket.png'
// import { useRouter } from "next/navigation"

// export function NavBar() {

//     const session = useSession();
//     const router = useRouter();

//     return (
//         <>
//             <div className="z-[999] h-[40px] fixed w-full top-0 overflow-hidden rounded-full p-[2px] ">
//                 <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/80 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
//                     <aside className="flex items-center gap-[10px]">
//                         <Image
//                             src={Rocker}
//                             width={50}
//                             height={50}
//                             alt="Rocket logo"
//                             className="shadow-sm rounded-full invert"
//                         />
//                         <p className="text-neutral-100 text-xl font-bold">InstaLive</p>
//                     </aside>
//                     <aside className="flex items-center gap-4">
//                         <div className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
//                             <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFFFF_0%,#000000_50%,#FFFFFF_100%)]`} />
//                             <div className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white backdrop-blur-3xl ${session?.data?.user ? "" : "px-3 py-1"}`}
//                                 onClick={async () => {
//                                     session?.data?.user ? router.push("/dashboard") : await signIn();
//                                 }}
//                             >
//                                 {session?.data?.user ? <Image src={session.data.user.image || " "
//                                 } alt="Profile Image" height={50} width={50} className="rounded-full" /> : "Get Started"}
//                             </div>
//                         </div>
//                     </aside>
//                 </header>
//             </div>
//             <div className="pt-[60px]"> {/* Adjust this padding as necessary */}
//                 {/* Your main content goes here */}
//             </div>
//         </>
//     )
// }

'use client';
import React, { useState } from 'react';
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
  AvatarItem,
  LogoItem,
} from './ui/navbar-menu';
import { cn } from '@/utils/cn';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';

export default function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Avatar() {
  const router = useRouter();
  const session = useSession();
  return (
    <div
      className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white backdrop-blur-3xl ${session?.data?.user ? '' : 'px-3 py-1'}`}
      onClick={async () => {
        session?.data?.user ? router.push('/dashboard') : await signIn();
      }}
    >
      {session?.data?.user ? (
        <Image
          src={session.data.user.image || ' '}
          alt="Profile Image"
          height={50}
          width={50}
          className="rounded-full"
        />
      ) : (
        'Get Started'
      )}
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  const session = useSession();

  return (
    <div
      className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <Menu setActive={setActive}>
        {/* @ts-ignore */}
        <LogoItem src={logo}> </LogoItem>

        <div className="flex w-[70%] items-center justify-around">
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/web-dev">Web Development</HoveredLink>
              <HoveredLink href="/interface-design">
                Interface Design
              </HoveredLink>
              <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
              <HoveredLink href="/branding">Branding</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
        </div>

        {/* @ts-ignore */}
        {session?.data?.user && (
          <AvatarItem
            setActive={setActive}
            active={active}
            item={session?.data?.user.image}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </AvatarItem>
        )}
      </Menu>
    </div>
  );
}
