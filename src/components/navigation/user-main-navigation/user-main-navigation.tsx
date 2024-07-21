import Image from "next/image"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"

import { BackButton } from "./back-button"
import { CartButton } from "./cart-button"
import { UserMenu } from "./menu"
import { SearchBar } from "./searchbar"
import { StoreButton } from "./store-button"

export function UserMainNavigation({ back }: { back?: boolean }) {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-neutral-950">
      <div className="flex w-full items-center gap-4 lg:w-3/6">
        {back && <BackButton size={20} />}
        <Link
          href="/"
          className="relative hidden h-12 w-12 justify-center lg:flex lg:h-16 lg:w-16"
        >
          <Image src="/next_marketplace.webp" alt="next-logo" fill />
        </Link>
        <SearchBar />
      </div>
      <div className="flex w-4/6 items-center justify-end gap-4 px-2 lg:w-2/6 lg:gap-6">
        <div className="flex items-center gap-4">
          <CartButton />
          <Separator
            className="h-7 w-px rounded-full bg-slate-200 dark:bg-gray-700"
            orientation="vertical"
          />
          <StoreButton />
        </div>
        <UserMenu />
      </div>
    </div>
  )
}
