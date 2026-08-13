"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

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
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Set a new password</h1>
      <p className="mt-2 text-muted">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">New password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius)] border border-grey-line bg-white px-4 py-3 text-text focus:outline-none focus:border-navy"
          />
        </label>

        {error && <p className="text-sm text-blue font-medium">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
