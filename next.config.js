/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
    "/api/cron/daily-email-report": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
    "/src/app/api/cron/daily-email-report/route": [
      "./node_modules/pdfkit/js/data/**/*",
    ],
  },
}

module.exports = nextConfig
