import { Metadata } from "next"
import { getWishlist } from "@/actions/user/wishlist"
import { WishlistItems } from "@/modules/user/wishlist-page/components/wishlist-items"

export const metadata: Metadata = {
  title: "Wishlist",
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
