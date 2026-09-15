import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Remove output: 'export', basePath, and assetPrefix unless hosting on GitHub Pages */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/auth/login',
      destination: '/login',
      permanent: true,
    },
  ],
};

export default nextConfig;
