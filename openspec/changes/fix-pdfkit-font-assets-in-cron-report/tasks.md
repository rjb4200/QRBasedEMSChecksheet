## 1. Add output file tracing includes to next.config.ts

- [ ] 1.1 Read current next.config.ts to understand existing output configuration
- [ ] 1.2 Add outputFileTracingIncludes for PDFKit AFM files under server.js
- [ ] 1.3 Verify the config is valid by running `npx next lint` or `npm run build`

## 2. Verify fix works in production bundle

- [ ] 2.1 Run `npm run build` to generate standalone output
- [ ] 2.2 Verify AFM files are included in the build output (check .next/server/chunks or cache)
- [ ] 2.3 Commit and push to GitHub to trigger deployment
- [ ] 2.4 Test cron endpoint in production with `?force=true` parameter
- [ ] 2.5 Verify PDF is generated successfully without ENOENT errors