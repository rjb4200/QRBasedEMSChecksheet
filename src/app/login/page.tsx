import { Suspense } from "react";
import { signInAdmin } from "@/lib/auth/actions";

const WFD_LOGO_SRC = "/images/WFD_Logo_1848.jpg";

function LoginContent({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-4">
            <img alt="Winchester Fire Department logo" className="h-16 w-16 rounded-2xl bg-white object-contain p-1 shadow-lg" src={WFD_LOGO_SRC} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">Winchester Fire Department</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">qrCheckoff</h1>
              <p className="text-sm font-bold text-slate-300">Equipment Check System</p>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Enter the admin username and password. Your session is saved in a browser cookie so you stay signed in.
          </p>

          {searchParams.error ? (
            <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}

          <form action={signInAdmin} className="mt-6 grid gap-3">
            <input name="next" type="hidden" value={searchParams.next ?? "/admin"} />
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Username
              <input
                className="rounded-2xl border border-white/20 bg-white px-4 py-4 text-base text-slate-950 outline-none ring-red-500 focus:ring-4"
                name="username"
                placeholder="Username"
                required
                type="text"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Password
              <input
                className="rounded-2xl border border-white/20 bg-white px-4 py-4 text-base text-slate-950 outline-none ring-red-500 focus:ring-4"
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </label>
            <button className="w-full rounded-2xl bg-red-700 px-5 py-4 font-bold text-white" type="submit">
              Sign In
            </button>
          </form>
          <p className="mt-5 text-center text-xs font-semibold text-slate-400">City of Winchester, Kentucky</p>
        </div>
      </section>
    </main>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  return (
    <Suspense>
      <LoginContent searchParams={await searchParams} />
    </Suspense>
  );
}
