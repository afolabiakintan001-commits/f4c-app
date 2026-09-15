import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/f4c-app",
  assetPrefix: "/f4c-app/",
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/auth/login",
      destination: "/login",
      permanent: true,
    },
    {
      source: "/auth/signup",
      destination: "/login",
      permanent: true,
    },
  ],
};

export default nextConfig;
