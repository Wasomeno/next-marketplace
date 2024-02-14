import React from "react"
import { BiSolidStar } from "react-icons/bi"
import { RiChatDeleteFill } from "react-icons/ri"

import { getProductReviews } from "@/app/actions/product"

import { ReviewCard } from "./review-card"

export async function ProductReviews({ productId }: { productId: number }) {
  const reviews = await getProductReviews(productId)
  return (
    <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:justify-normal lg:gap-10">
      <div className="w-full space-y-2 lg:w-80 lg:space-y-4">
        <h2 className="text-base font-medium lg:text-lg">Overall Rating</h2>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-3xl lg:text-5xl">
            <BiSolidStar className="h-6 w-6 text-yellow-400 lg:h-8 lg:w-8" />
            {reviews.length === 0
              ? 0
              : reviews.reduce(
                  (ratingSum, nextReview) => ratingSum + nextReview.rating,
                  0
                ) / reviews.length}{" "}
            <span className="text-xl lg:text-3xl">/ 5</span>
          </div>
          <span className="text-sm opacity-50">{reviews.length} reviews</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-2 lg:space-y-4">
        <h2 className="text-base font-medium lg:text-lg">Reviews</h2>
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
