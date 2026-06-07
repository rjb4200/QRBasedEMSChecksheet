export default function UnitDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-48 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-2xl bg-slate-200" />
            <div className="h-8 w-24 rounded-2xl bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-12 rounded-2xl bg-slate-100" />
              <div className="h-8 w-12 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid sm:grid-cols-[1fr_130px_auto] gap-4">
          <div className="col-span-full h-4 w-32 rounded bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid sm:grid-cols-[1fr_1fr_130px_auto] gap-4">
          <div className="col-span-full h-4 w-36 rounded bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="grid md:grid-cols-[minmax(0,1fr)_130px] gap-4">
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
          </div>
          <div className="h-10 w-24 rounded-2xl bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
            <div className="h-10 rounded-2xl bg-slate-100" />
            <div className="h-10 rounded-2xl bg-slate-100" />
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-20 rounded-2xl bg-slate-100" />
            <div className="h-10 w-20 rounded-2xl bg-slate-200" />
          </div>
        </div>

        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-8 w-8 rounded-2xl bg-slate-100" />
            </div>
            <div className="space-y-3">
              <div className="h-10 rounded-2xl bg-slate-100" />
              <div className="h-10 rounded-2xl bg-slate-100" />
              <div className="h-10 rounded-2xl bg-slate-100" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
