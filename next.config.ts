import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    qualities: [45, 75],
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.0.122",
    "192.168.0.122:3000",
  ],
};

export default nextConfig;
