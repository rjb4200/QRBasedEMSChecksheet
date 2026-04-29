import { Suspense } from "react";
import { signInWithProvider } from "@/lib/auth/actions";

function LoginContent({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">Winchester EMS</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use your Winchester Google Workspace account. Microsoft sign-in is available for approved part-time staff.
          </p>

          {searchParams.error ? (
            <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <form action={async () => {
              "use server";
              await signInWithProvider("google");
            }}>
              <button className="w-full rounded-2xl bg-white px-5 py-4 font-bold text-slate-950" type="submit">
                Continue with Google
              </button>
            </form>
            <form action={async () => {
              "use server";
              await signInWithProvider("azure");
            }}>
              <button className="w-full rounded-2xl border border-white/20 px-5 py-4 font-bold text-white" type="submit">
                Continue with Microsoft
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <Suspense>
      <LoginContent searchParams={await searchParams} />
    </Suspense>
  );
}
