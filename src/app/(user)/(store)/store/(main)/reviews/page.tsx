import { StoreProductReviewsTable } from "@/modules/user/store/review-page/components/store-product-reviews-table"
import { StoreReviewCount } from "@/modules/user/store/review-page/components/store-review-count"

export default async function UserStoreReviews() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Reviews</h1>
        <StoreReviewCount />
      </div>
      <StoreProductReviewsTable />
    </div>
  )
}
