export default function KitsLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="h-10 w-24 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-[22rem] rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <div className="h-5 w-44 rounded bg-slate-200" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-6 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-56 rounded bg-slate-100" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                  <div className="h-4 w-12 rounded bg-slate-100" />
                  <div className="h-8 w-8 rounded-2xl bg-slate-100" />
                  <div className="h-8 w-8 rounded-2xl bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
