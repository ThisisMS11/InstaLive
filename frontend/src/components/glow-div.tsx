import React from 'react';
import { motion } from 'framer-motion';

export default function GlowDiv({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <>
            <motion.section className="absolute z-40 right-[10rem] top-[12rem] hidden rotate-12 items-center justify-center drop-shadow-[0_60px_100px_#60e26d] lg:flex">
                <motion.div
                    className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-400 to-green-600 md:h-48 md:w-48"
                    style={{
                        boxShadow:
                            '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                        transform: 'rotate(12deg)',
                    }}
                >
                    <motion.div className="borer-2 w-fit rounded-3xl px-4 py-4">
                        {children}
                    </motion.div>
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-900 opacity-30" />

                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent opacity-90"
                        style={{
                            mixBlendMode: 'soft-light',
                        }}
                    />

                    <motion.div
                        className="bg-gradient-radial absolute inset-0 from-green-100 to-transparent opacity-50"
                        style={{
                            background:
                                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%)',
                        }}
                    />

                    {/* <motion.div
            className="absolute inset-0 animate-pulse opacity-30"
            style={{
              background:
                'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite',
            }}
          /> */}

                    {/* <motion.div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-transparent opacity-30" /> */}
                </motion.div>
            </motion.section>
        </>
    );
}
