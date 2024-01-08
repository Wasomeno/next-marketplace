import { HiXCircle } from "react-icons/hi2"

import { prisma } from "@/lib/prisma"
import { getStore } from "@/app/actions/store"

export default async function UserStoreReviews() {
  const store = await getStore()
  const reviews = await prisma.productReview.findMany({
    where: { product: { store_id: store?.id } },
  })

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Reviews</h1>
        <span className="text-sm text-gray-500">0 Reviews</span>
      </div>
      {reviews.length > 0 && (
        <div className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {reviews.map((review) => (
            <div key={review.id} className="font-medium">
              {review.review}
            </div>
          ))}
        </div>
      )}
      {reviews.length < 1 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <HiXCircle size={25} />
            <span>No Reviews</span>
          </div>
        </div>
      )}
    </div>
  )
}
