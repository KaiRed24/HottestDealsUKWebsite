import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Your account</h1>
      <p className="mt-2 text-ink/70">{user.email}</p>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/basket"
          className="rounded-brand border border-ink/10 bg-paper px-5 py-4 font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          View basket
        </Link>
        <Link
          href="/shop"
          className="rounded-brand border border-ink/10 bg-paper px-5 py-4 font-semibold text-ink hover:bg-ink/5 transition-colors"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
