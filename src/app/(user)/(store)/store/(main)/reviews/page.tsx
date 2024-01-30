import { StoreProductReviewsTable } from "@/components/user/store/store-product-reviews-table"

export default async function UserStoreReviews() {
  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Reviews</h1>
      <StoreProductReviewsTable />
    </div>
  )
}
