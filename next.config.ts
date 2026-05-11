import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/*": [
      "./USERGUIDE.md",
      "./ADMINGUIDE.md",
    ],
  },
};

export default nextConfig;
