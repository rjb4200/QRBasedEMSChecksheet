/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/pdfkit/js/data/**/*",
      "./USERGUIDE.md",
      "./ADMINGUIDE.md",
    ],
  },
}

module.exports = nextConfig
