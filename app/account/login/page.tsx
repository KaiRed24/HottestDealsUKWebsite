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
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Log in</h1>
      <p className="mt-2 text-muted">Welcome back to Hottest Deals UK.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[var(--radius)] border border-grey-line bg-white px-4 py-3 text-text focus:outline-none focus:border-navy"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius)] border border-grey-line bg-white px-4 py-3 text-text focus:outline-none focus:border-navy"
          />
        </label>

        {error && <p className="text-sm text-blue font-medium">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-muted">
        <Link href="/account/reset-password" className="hover:text-navy transition-colors">
          Forgot your password?
        </Link>
        <p>
          New here?{" "}
          <Link href="/account/signup" className="font-medium text-blue hover:text-navy transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
