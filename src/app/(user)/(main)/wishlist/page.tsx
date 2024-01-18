import { Metadata } from "next"

import { WishlistItems } from "@/components/user/wishlist/wishlist-items"
import { getWishlist } from "@/app/actions/user/wishlist"

export const metadata: Metadata = {
  title: "Wishlist | Next Marketplace",
}

export default async function WishlistPage() {
  const wishlist = await getWishlist()
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <h1 className="mb-2 text-base font-medium lg:text-xl">Wishlist</h1>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {wishlist.count} items
        </span>
      </div>
      <WishlistItems items={wishlist.items} />
    </div>
  )
}
