import { Suspense } from "react";
import { signInWithEmail } from "@/lib/auth/actions";

function LoginContent({ searchParams }: { searchParams: { error?: string; sent?: string; next?: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">Winchester EMS</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Enter your email address and we will send you a secure sign-in link. Your session is saved in a browser cookie so you stay signed in.
          </p>

          {searchParams.error ? (
            <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}

          {searchParams.sent ? (
            <div className="mt-5 rounded-2xl border border-green-400/40 bg-green-950/60 p-4 text-sm text-green-100">
              Sign-in link sent to {searchParams.sent}. Open the email on this device to continue.
            </div>
          ) : null}

          <form action={signInWithEmail} className="mt-6 grid gap-3">
            <input name="next" type="hidden" value={searchParams.next ?? "/units"} />
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Email address
              <input
                className="rounded-2xl border border-white/20 bg-white px-4 py-4 text-base text-slate-950 outline-none ring-red-500 focus:ring-4"
                name="email"
                placeholder="name@example.com"
                required
                type="email"
              />
            </label>
            <button className="w-full rounded-2xl bg-red-700 px-5 py-4 font-bold text-white" type="submit">
              Send Sign-In Link
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; sent?: string; next?: string }> }) {
  return (
    <Suspense>
      <LoginContent searchParams={await searchParams} />
    </Suspense>
  );
}
