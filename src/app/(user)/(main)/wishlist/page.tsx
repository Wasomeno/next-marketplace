import { Metadata } from "next"

import { BackButton } from "@/components/back-button"
import { WishlistItemsSection } from "@/components/user/wishlist/wishlist-items-section"
import { getWishlist } from "@/app/actions/wishlist"

export const metadata: Metadata = {
  title: "Wishlist | Next Marketplace",
}

type Props = {
  searchParams: { pmin: string; pmax: string; sort: string }
}

export default async function WishlistPage({ searchParams }: Props) {
  const wishlist = await getWishlist()
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <BackButton />
          <h1 className="text-base font-medium lg:text-xl">Wishlist</h1>
        </div>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {wishlist.count} items
        </span>
      </div>
      <WishlistItemsSection items={wishlist.items} />
    </div>
  )
}
