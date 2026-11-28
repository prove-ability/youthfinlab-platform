import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "**.naver.net",
      },
      {
        protocol: "https",
        hostname: "blogfiles.naver.net",
      },
    ],
  },
};

export default nextConfig;
