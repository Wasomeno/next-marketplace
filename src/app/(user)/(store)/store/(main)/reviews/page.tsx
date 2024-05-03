import { redirect } from "next/navigation"
import { getStore } from "@/actions/store/store"
import { getCachedSession } from "@/actions/store/user"
import { StoreProductReviewsTable } from "@/modules/user/store/review-page/components/store-product-reviews-table"
import { StoreReviewCount } from "@/modules/user/store/review-page/components/store-review-count"

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
        <h1 className="text-lg font-medium lg:text-2xl">Reviews</h1>
        <StoreReviewCount storeId={store?.id} />
      </div>
      <StoreProductReviewsTable storeId={store?.id} />
    </div>
  )
}
