export default function KitDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-10 w-48 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-4 w-24 rounded bg-slate-200" />
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-32 rounded-2xl bg-slate-100" />
              <div className="h-10 w-36 rounded-2xl bg-slate-200" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-slate-100" />
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="h-10 w-full rounded-2xl bg-slate-200" />
              <div className="mt-2 h-4 w-48 rounded bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-28 rounded bg-slate-200" />
          <div className="flex flex-wrap gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-2xl bg-slate-100" />
            ))}
          </div>
          <div className="grid sm:grid-cols-[1fr_180px_auto] gap-4">
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-200" />
          </div>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-100" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 rounded bg-slate-100" />
                  <div className="h-8 w-20 rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
