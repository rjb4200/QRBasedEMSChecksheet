export default function IssueDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-4xl space-y-6 animate-pulse">
        <div className="h-5 w-32 rounded bg-slate-200" />

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-64 rounded bg-slate-200" />
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
              <div className="h-5 w-48 rounded bg-slate-100" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-100" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-slate-200" />
            <div className="h-5 w-16 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-10 w-full rounded-2xl bg-slate-100" />
          <div className="h-24 w-full rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
          </div>
          <div className="h-10 w-full rounded-2xl bg-slate-100" />
          <div className="h-12 w-36 rounded-2xl bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-24 w-full rounded-2xl bg-slate-100" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 rounded-xl bg-slate-100" />
            <div className="h-10 w-16 rounded-xl bg-slate-200" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="h-6 w-20 rounded bg-slate-200" />
        </div>
      </section>
    </main>
  );
}
