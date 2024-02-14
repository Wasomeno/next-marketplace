"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export const UserSettingsTabs = () => {
  const pathname = usePathname()
  return (
    <div className="mb-4 flex w-full items-center gap-2 rounded-lg lg:w-96 ">
      <Link
        href="/settings"
        className={clsx(
          "w-32 rounded-lg border  px-4 py-2 text-center text-sm shadow-sm transition-all duration-200",
          pathname === "/settings"
            ? "border-blue-300 bg-blue-400 font-medium text-white"
            : "border-gray-200 hover:bg-blue-400 hover:text-white"
        )}
      >
        Profile
      </Link>
      <Link
        href="/settings/address"
        className={clsx(
          "w-32 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm shadow-sm transition-all duration-200",
          pathname === "/settings/address"
            ? "border-blue-300 bg-blue-400 font-medium text-white"
            : "border-gray-200 hover:bg-blue-400 hover:text-white"
        )}
      >
        Address
      </Link>
    </div>
  )
}
