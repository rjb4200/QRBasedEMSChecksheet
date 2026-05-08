import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/**": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
  },
};

export default nextConfig;
