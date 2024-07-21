"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export const UserSettingSideNavigation = () => {
  const pathname = usePathname()

  function getStyle(href: string) {
    return twMerge(
      clsx(
        "rounded-md lg:px-4 px-0 lg:py-2 pb-2 lg:text-sm text-xs font-medium text-gray-400 transition-all duration-300 lg:hover:bg-gray-100",
        pathname === href && "text-black"
      )
    )
  }

  return (
    <div className="flex w-full flex-row gap-4 border-b pl-0 pr-2 lg:w-1/6 lg:flex-col lg:gap-1 lg:border-r lg:pl-4 lg:pr-4">
      <Link href="/settings" className={getStyle("/settings")}>
        Profile
      </Link>
      <Link href="/settings/address" className={getStyle("/settings/address")}>
        Address
      </Link>
    </div>
  )
}
