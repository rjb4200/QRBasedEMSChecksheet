import Link from "next/link";

export default function OAuthConsentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">OAuth Consent</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Continue to EMS Checkoff</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This local consent page is available for Supabase OAuth preview and MCP authentication flows. Use the app login page for Winchester EMS access.
        </p>
        <div className="mt-6 grid gap-3">
          <Link className="rounded-2xl bg-red-700 px-5 py-4 text-center font-bold text-white" href="/login">
            Go to Login
          </Link>
          <Link className="rounded-2xl border border-white/20 px-5 py-4 text-center font-bold text-slate-200" href="/">
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
