import { Copyright } from 'lucide-react';
import React from 'react';

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="relative border-t-2 border-accent z-10 mt-40 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="text-2xl font-bold">Instalive</div>
                        <div className="flex items-center text-sm">
                            <Copyright className="w-4 h-4 mr-1" />
                            <span>2024 Created with ❤️ by Instalive Team</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
