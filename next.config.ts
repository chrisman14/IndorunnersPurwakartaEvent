import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Remove turbopack config for production deployment
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      root: ".",
    },
  }),
  // Ensure proper static generation
  output: 'standalone',
};

export default nextConfig;
