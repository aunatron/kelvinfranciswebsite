import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
