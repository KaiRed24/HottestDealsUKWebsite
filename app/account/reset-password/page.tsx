"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/account/update-password` : undefined,
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
        <h1 className="font-display text-3xl font-bold text-ink">Check your email</h1>
        <p className="mt-3 text-ink/70">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to
          reset your password.
        </p>
        <Link
          href="/account/login"
          className="mt-8 inline-block rounded-full bg-red text-white font-semibold px-6 py-3.5 min-h-11 hover:bg-red-deep transition-colors"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Reset your password</h1>
      <p className="mt-2 text-ink/70">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

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

        {error && <p className="text-sm text-red font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-red text-white font-semibold px-6 py-3.5 min-h-11 hover:bg-red-deep transition-colors disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        <Link href="/account/login" className="font-semibold text-red hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
