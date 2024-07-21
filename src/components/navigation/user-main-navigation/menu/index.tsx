import Link from "next/link"
import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"

import { UserMainMenu } from "./main"
import { UserMobileMenu } from "./mobile"

export async function UserMenu() {
  const session = await getServerSession(authOptions)

  return session?.user.email ? (
    <>
      <UserMainMenu session={session} />
      <UserMobileMenu session={session} />
    </>
  ) : (
    <div className="flex items-center justify-center gap-2">
      <Link
        href="/login"
        className="rounded-md bg-blue-400 px-3 py-1.5 font-sans text-xs font-medium tracking-tight text-white lg:text-sm"
      >
        Sign In
      </Link>
    </div>
  )
}
