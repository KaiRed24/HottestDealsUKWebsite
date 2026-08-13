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
        <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Check your email</h1>
        <p className="mt-3 text-muted">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to
          reset your password.
        </p>
        <Link href="/account/login" className="btn-primary mt-8">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Reset your password</h1>
      <p className="mt-2 text-muted">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

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

        {error && <p className="text-sm text-blue font-medium">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        <Link href="/account/login" className="font-medium text-blue hover:text-navy transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}
