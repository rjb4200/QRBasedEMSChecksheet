export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 animate-pulse">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-5 w-96 rounded bg-slate-100" />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="space-y-3">
            <div className="h-12 w-full rounded-2xl bg-slate-100" />
            <div className="h-12 w-full rounded-2xl bg-slate-100" />
            <div className="h-12 w-full rounded-2xl bg-slate-100" />
          </div>
        </div>
      </section>
    </main>
  );
}
