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
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Your account</h1>
      <p className="mt-2 text-muted">{user.email}</p>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/basket"
          className="rounded-[var(--radius)] border border-grey-line bg-white px-5 py-4 font-medium text-text hover:border-navy transition-colors duration-150"
        >
          View basket
        </Link>
        <Link
          href="/shop"
          className="rounded-[var(--radius)] border border-grey-line bg-white px-5 py-4 font-medium text-text hover:border-navy transition-colors duration-150"
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
