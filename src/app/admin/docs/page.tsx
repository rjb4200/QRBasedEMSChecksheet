import { readFile } from "node:fs/promises";
import path from "node:path";
import Markdown from "react-markdown";
import Link from "next/link";

function extractToc(markdown: string) {
  return Array.from(markdown.matchAll(/^### (.+)$/gm)).map((m) => ({
    text: m[1],
    anchor: m[1].toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
}

export default async function AdminGuidePage() {
  const [adminContent, userContent] = await Promise.all([
    readFile(path.join(process.cwd(), "ADMINGUIDE.md"), "utf-8"),
    readFile(path.join(process.cwd(), "USERGUIDE.md"), "utf-8"),
  ]);

  const isUserGuide = false;
  const content = isUserGuide ? userContent : adminContent;
  const toc = isUserGuide ? extractToc(userContent) : extractToc(adminContent);
  const title = isUserGuide ? "User Guide" : "Admin Guide";

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">{title}</h1>
            <a className="mt-1 inline-block text-sm font-bold text-red-700 underline" href="/api/docs/admin-guide">Download Guide</a>
          </div>
          <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href="/admin">Back to Admin</Link>
        </div>
        <div className="flex gap-8">
          <nav className="sticky top-8 hidden w-56 shrink-0 self-start lg:block">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Sections</p>
            <ul className="mt-3 space-y-1">
              {toc.map(({ text, anchor }) => (
                <li key={anchor}>
                  <a className="block rounded-lg px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900" href={`#${anchor}`}>{text}</a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="min-w-0 flex-1 rounded-3xl bg-white p-8 shadow-sm">
            <div className="prose prose-slate max-w-none">
              <Markdown
                components={{
                  code({ className, children }: { className?: string; children?: React.ReactNode }) {
                    const text = String(children).trim();
                    if (!className && text.startsWith("/")) {
                      return <Link className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold text-red-700 no-underline" href={text}>{text}</Link>;
                    }
                    return <code className={className}>{children}</code>;
                  },
                }}
              >
                {content}
              </Markdown>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
