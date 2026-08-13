"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-14 text-center">
        <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Check your email</h1>
        <p className="mt-3 text-muted">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then log in.
        </p>
        <Link href="/account/login" className="btn-primary mt-8">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Create an account</h1>
      <p className="mt-2 text-muted">Join Hottest Deals UK.</p>

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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius)] border border-grey-line bg-white px-4 py-3 text-text focus:outline-none focus:border-navy"
          />
          <span className="text-xs text-muted">At least 6 characters.</span>
        </label>

        {error && <p className="text-sm text-blue font-medium">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-blue hover:text-navy transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
