import React from "react"
import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

import { authOptions } from "@/config/next-auth"

import { UserStoreMenu } from "./user-store-menu"

export async function StoreTopNavigation() {
  const session = await getServerSession(authOptions)

  invariant(session)

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white shadow-sm lg:px-4 dark:border-gray-800 dark:bg-neutral-950">
      <div className="flex w-full items-center gap-4 lg:w-1/6">
        <Link href="/store/home" className="flex items-center">
          <Image
            src="/next_marketplace.webp"
            alt="next-logo"
            width={60}
            height={60}
          />
          <span className="font-medium">Store</span>
        </Link>
      </div>
      <UserStoreMenu session={session} />
    </div>
  )
}
