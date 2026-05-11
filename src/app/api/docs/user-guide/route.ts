import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const content = await readFile(path.join(process.cwd(), "USERGUIDE.md"), "utf-8");
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"USERGUIDE.md\"",
    },
  });
}
