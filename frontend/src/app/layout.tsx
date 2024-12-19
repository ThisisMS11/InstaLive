import type { Metadata } from 'next';
import { Figtree, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'InstaLive',
  description: 'Will make you go live.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(figtree.variable, jakarta.variable, 'font-secondary')}
      >
        <Providers>
          <div className="pt-[0px]">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
            <Analytics />
          </div>
        </Providers>
      </body>
    </html>
  );
}
