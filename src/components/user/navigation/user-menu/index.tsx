import { Session } from "next-auth";
import Link from "next/link";

import { UserMenuMain } from "./user-menu-main";
import { UserMenuMobile } from "./user-menu-mobile";

export const UserMenu = ({ session }: { session: Session | null }) => {
  return session ? (
    <>
      <UserMenuMain session={session} />
      <UserMenuMobile session={session} />
    </>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-md bg-neutral-200 px-3 py-2 font-sans text-sm"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="rounded-md border border-neutral-200 px-3 py-2 font-sans text-sm"
      >
        Sign Up
      </Link>
    </div>
  );
};
