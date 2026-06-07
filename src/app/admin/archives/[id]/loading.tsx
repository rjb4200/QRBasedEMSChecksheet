export default function ArchiveDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="h-4 w-4 rounded bg-slate-100" />
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-4 rounded bg-slate-100" />
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-4 rounded bg-slate-100" />
          <div className="h-5 w-16 rounded-full bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-5 w-28 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-3">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-3">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-4 w-8 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
