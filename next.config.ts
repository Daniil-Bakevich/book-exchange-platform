import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.freeimages.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
