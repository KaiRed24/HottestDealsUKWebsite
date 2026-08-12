"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Log in</h1>
      <p className="mt-2 text-ink/70">Welcome back to Hottest Deals UK.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-brand border border-ink/15 bg-paper px-4 py-3 text-ink"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-brand border border-ink/15 bg-paper px-4 py-3 text-ink"
          />
        </label>

        {error && <p className="text-sm text-red font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-red text-white font-semibold px-6 py-3.5 min-h-11 hover:bg-red-deep transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-ink/70">
        <Link href="/account/reset-password" className="hover:text-ink">
          Forgot your password?
        </Link>
        <p>
          New here?{" "}
          <Link href="/account/signup" className="font-semibold text-red hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
