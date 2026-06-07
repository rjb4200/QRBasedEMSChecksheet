export default function SystemLogLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="h-10 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-[28rem] rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-100" />
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm grid md:grid-cols-6 gap-4">
          <div className="col-span-full h-4 w-20 rounded bg-slate-200" />
          <div className="md:col-span-2 h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="col-span-full flex gap-2">
            <div className="h-10 w-20 rounded-2xl bg-slate-200" />
            <div className="h-10 w-20 rounded-2xl bg-slate-100" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-3 shadow-sm flex items-center justify-between">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="flex gap-3">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>
        </div>

        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-16 rounded-full bg-slate-200" />
                <div className="h-5 w-20 rounded-full bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-4 w-48 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
