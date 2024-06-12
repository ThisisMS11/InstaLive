import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from '@/components/Providers'
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaLive",
  description: "Will make you go live.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="pt-[40px]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
