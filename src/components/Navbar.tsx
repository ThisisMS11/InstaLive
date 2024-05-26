"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import Image from "next/image"
import Rocker from '@/app/assets/rocket.png'
import { useRouter } from "next/navigation"

export function NavBar() {

    const session = useSession();
    const router = useRouter();

    return (
        <>
            <div className="z-[999] h-[40px] fixed w-full top-0 overflow-hidden rounded-full p-[2px] ">
                <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/80 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
                    <aside className="flex items-center gap-[10px]">
                        <Image
                            src={Rocker}
                            width={50}
                            height={50}    
                            alt="Rocket logo"
                            className="shadow-sm rounded-full invert"
                        />
                        <p className="text-neutral-100 text-xl font-bold">LiveMe</p>
                    </aside>
                    <aside className="flex items-center gap-4">
                        <div className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFFFF_0%,#000000_50%,#FFFFFF_100%)]`} />
                            <div className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white backdrop-blur-3xl ${session?.data?.user ? "" : "px-3 py-1"}`}
                                onClick={async () => {
                                    session?.data?.user ? router.push("/dashboard") : await signIn();
                                }}
                            >
                                {session?.data?.user ? <Image src={session.data.user.image || " "
                                } alt="Profile Image" height={50} width={50} className="rounded-full" /> : "Get Started"}
                            </div>
                        </div>
                    </aside>
                </header>
            </div>
            <div className="pt-[60px]"> {/* Adjust this padding as necessary */}
                {/* Your main content goes here */}
            </div>
        </>
    )
}
