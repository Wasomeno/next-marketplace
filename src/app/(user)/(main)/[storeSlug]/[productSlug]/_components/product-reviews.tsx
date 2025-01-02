import { getProductReviews } from "@/actions/product"
import React from "react"
import { BiSolidStar } from "react-icons/bi"
import { RiChatDeleteFill } from "react-icons/ri"

import { ReviewCard } from "./review-card"

export async function ProductReviews({ productId }: { productId: number }) {
  const reviews = await getProductReviews(productId)
  return (
    <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:justify-normal lg:gap-10">
      <div className="flex flex-1 flex-col space-y-2 lg:space-y-4">
        <h2 className="text-base font-medium lg:text-xl">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex flex-1 flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
        {reviews.length === 0 && (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border text-gray-400">
            <RiChatDeleteFill size={20} />
            <span className="text-sm">No Reviews</span>
          </div>
        )}
      </div>
    </div>
  )
}
