import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/cron/daily-email-report/**": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
  },
};

export default nextConfig;
