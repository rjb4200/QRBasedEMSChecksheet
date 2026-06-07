export default function CheckoffLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-3xl bg-white p-5 shadow-sm space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-8 w-56 rounded bg-slate-200" />
          <div className="h-48 w-full rounded-2xl bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm space-y-4">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-10 w-20 rounded-2xl bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="h-10 w-full rounded-2xl bg-slate-100" />
          </div>
        </div>
      </section>
    </main>
  );
}
