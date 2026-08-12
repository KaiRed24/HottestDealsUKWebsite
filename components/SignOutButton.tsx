"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full ring-1 ring-ink/15 text-ink font-semibold px-6 py-3 min-h-11 hover:bg-ink/5 transition-colors"
    >
      Sign out
    </button>
  );
}
