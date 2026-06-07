export default function ArchivesLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="h-10 w-72 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-[32rem] rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="h-64 w-full rounded-2xl bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid grid-cols-4 gap-4">
          <div className="col-span-4 h-4 w-20 rounded bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm space-y-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                </div>
                <div className="h-4 w-64 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="h-4 w-16 mx-auto rounded bg-slate-200" />
              <div className="h-8 w-12 mx-auto rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm space-y-4">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="flex gap-4">
            <div className="h-10 w-40 rounded-2xl bg-slate-100" />
            <div className="h-10 w-40 rounded-2xl bg-slate-100" />
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
            <div className="h-10 w-28 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </section>
    </main>
  );
}
