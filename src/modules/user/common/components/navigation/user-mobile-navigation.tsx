"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"

import { userMobilePaths } from "@/config/paths"

export const UserMobileNavigation = () => {
  const pathname = usePathname()
  const params = useParams()

  const pathSplit = pathname.split("/")[1] !== "" ? pathname.split("/")[1] : "/"
  return (
    <div className="sticky bottom-0 z-10 flex w-full items-center justify-around border-t bg-white p-2.5 dark:border-t-gray-800 dark:bg-neutral-950 lg:hidden">
      {userMobilePaths.map((path) => (
        <Link
          key={path.title}
          href={`/${path.href}`}
          className="flex flex-col items-center gap-1.5"
        >
          <path.Icon
            size="18"
            className={twMerge(
              "text-slate-400",
              pathSplit.includes(path.href) && "text-blue-500"
            )}
          />
          <span
            className={twMerge(
              "text-xs text-slate-400",
              pathSplit.includes(path.href) && "text-blue-500"
            )}
          >
            {path.title}
          </span>
        </Link>
      ))}
    </div>
  )
}
