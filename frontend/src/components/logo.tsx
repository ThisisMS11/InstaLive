import React from 'react';

export default function Logo() {
    return (
        <>
            <div className="font-primary flex items-center gap-4 font-bold">
                <div className="flex flex-col gap-1">
                    <div className="h-1 rounded-sm w-8 translate-x-2 bg-primary"></div>
                    <div className="h-1 rounded-sm w-8 bg-primary"></div>
                    <div className="h-1 rounded-sm w-8 translate-x-2 bg-primary"></div>
                </div>
                <div className="text-lg">
                    Insta<span className="text-primary">Live</span>
                </div>
            </div>
        </>
    );
}
