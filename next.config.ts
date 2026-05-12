import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/*": [
      "./USERGUIDE.md",
      "./ADMINGUIDE.md",
      "./node_modules/pdfkit/js/data/**/*",
    ],
    "/api/cron/daily-email-report": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
  },
};

export default nextConfig;
