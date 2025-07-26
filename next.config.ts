import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL_URL;

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: isVercel
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  },
};

export default nextConfig;
