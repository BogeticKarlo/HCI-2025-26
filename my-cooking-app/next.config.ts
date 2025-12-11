import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudinary-marketing-res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
