import Image from "next/image"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { MainNavigationBackButton } from "@/components/user/navigation/main-navigation-back-button"

import { CartButton } from "./cart-button"
import { ProductSearchInput } from "./product-search-input"
import { UserMenu } from "./user-menu"

export async function UserMainNavigation() {
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-b-gray-200 bg-white px-2 shadow-sm dark:border-gray-800 dark:bg-neutral-950 lg:px-4">
      <div className="flex w-full items-center gap-2 lg:w-3/6">
        <MainNavigationBackButton size={20} />
        <Link
          href="/"
          className="relative  hidden h-12 w-12 justify-center lg:flex lg:h-16 lg:w-16"
        >
          <Image src="/next_marketplace.webp" alt="next-logo" fill />
        </Link>
        <ProductSearchInput />
      </div>
      <div className="flex w-3/6 items-center justify-end gap-4 px-2 lg:w-44">
        <CartButton />
        <Separator
          className="h-7 w-px rounded-full bg-slate-200 dark:bg-gray-700"
          orientation="vertical"
        />
        <UserMenu />
      </div>
    </div>
  )
}
