import { Metadata } from "next"

import { getWishlist } from "@/actions/user/wishlist"

import { WishlistItems } from "./_components/wishlist-items"

export const metadata: Metadata = {
  title: "Wishlist",
}

export default async function WishlistPage() {
  const wishlist = await getWishlist()
  return (
    <div className="flex flex-1 flex-col px-28">
      <div className="mb-4">
        <h1 className="text-base font-medium lg:text-xl">Wishlist</h1>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          {wishlist.count} items
        </span>
      </div>
      <WishlistItems items={wishlist.items} />
    </div>
  )
}
