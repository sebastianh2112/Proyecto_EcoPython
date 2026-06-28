import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'portaecommercepython-production.up.railway.app', pathname: '/media/**' },
      { protocol: 'http', hostname: 'portaecommercepython-production.up.railway.app', pathname: '/media/**' },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
