import Link from "next/link";

export default function DeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <section className="max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">Access denied</p>
        <h1 className="mt-4 text-3xl font-black">You do not have access to that area.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Ask an administrator to update your role if you need supervisor or admin access.</p>
        <Link className="mt-6 inline-flex rounded-full bg-red-700 px-5 py-3 font-bold" href="/units">
          Back to Units
        </Link>
      </section>
    </main>
  );
}
