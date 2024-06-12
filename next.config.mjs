/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "lh3.googleusercontent.com",
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: "yt3.ggpht.com",
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: "assets.aceternity.com",
                port: '',
                pathname: '/**',
            }
        ],
    }
};

export default nextConfig;
