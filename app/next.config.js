/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        unoptimized: process.env.NODE_ENV === "development",
    },
};

module.exports = nextConfig;
