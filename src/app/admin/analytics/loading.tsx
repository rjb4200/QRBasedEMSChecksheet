export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="h-10 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-[26rem] rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid sm:grid-cols-4 gap-4">
          <div className="col-span-full h-4 w-20 rounded bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 w-24 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
