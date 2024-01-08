import React from "react"
import Image from "next/image"
import Link from "next/link"

import { UserMenu } from "../navigation/user-menu"

export const StoreTopNavigation = () => {
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-neutral-950">
      <div className="flex w-full items-center gap-4 lg:w-1/6">
        <Link href="/store/home" className="flex items-center">
          <div className="relative h-16 w-16">
            <Image src="/next_marketplace.webp" alt="next-logo" fill />
          </div>
          <span className="font-medium">Store</span>
        </Link>
      </div>
      <div className="flex w-4/6 items-center justify-end gap-6 px-2 lg:w-2/6">
        <UserMenu />
      </div>
    </div>
  )
}
