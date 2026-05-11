import { readFile } from "fs/promises";
import path from "path";
import Markdown from "react-markdown";
import Link from "next/link";

export default async function UserGuidePage() {
  const content = await readFile(path.join(process.cwd(), "USERGUIDE.md"), "utf-8");

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">User Guide</h1>
            <a className="mt-1 inline-block text-sm font-bold text-red-700 underline" href="/api/docs/user-guide">Download Guide</a>
          </div>
          <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href="/units">Back to Units</Link>
        </div>
        <article className="prose max-w-none">
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </main>
  );
}
