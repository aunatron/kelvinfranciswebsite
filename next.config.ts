import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
