import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix Turbopack workspace root warning
  turbopack: {
    root: process.cwd(),
  },
  images: {
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
