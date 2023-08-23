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
  const sort = searchParams.sort ? [searchParams.sort.split(".")] : []

  const wislistItems = await getWishlist(sort)

  return (
    <div className="flex flex-1 flex-col px-0 lg:px-8">
      <div className="flex items-center px-2 lg:px-0">
        <BackButton />
        <h1 className="text-base font-medium lg:text-xl">Wishlist</h1>
      </div>
      <WishlistItemsSection items={wislistItems} />
    </div>
  )
}
