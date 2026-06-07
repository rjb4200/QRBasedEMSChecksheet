export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-[28rem] rounded bg-slate-100" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4 space-y-3">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-6 w-16 rounded bg-slate-100" />
                <div className="h-3 w-12 rounded bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 rounded-full bg-slate-200" />
                  <div className="h-4 flex-1 rounded bg-slate-100" />
                </div>
                <div className="h-3 w-32 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-3">
                <div className="h-4 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-72 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded bg-slate-200" />
              <div className="h-6 w-8 rounded-full bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 rounded-2xl bg-slate-100" />
              <div className="h-10 w-24 rounded-2xl bg-slate-100" />
              <div className="h-10 w-20 rounded-2xl bg-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-3">
                <div className="h-4 w-56 rounded bg-slate-100" />
                <div className="mt-1 h-3 w-48 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
