import { redirect } from "next/navigation"

import { getCachedSession } from "@/actions/store/user"

import { getStore } from "../../_actions"
import { StoreProductReviewsTable } from "./_components/store-product-reviews-table"
import { StoreReviewCount } from "./_components/store-review-count"

export default async function UserStoreReviews() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await getStore({ userEmail: session.user.email })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-bold lg:text-2xl">Reviews</h1>
        <StoreReviewCount storeId={store?.id} />
      </div>
      <StoreProductReviewsTable storeId={store?.id} />
    </div>
  )
}
