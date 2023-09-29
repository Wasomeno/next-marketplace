"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { AiFillStar } from "react-icons/ai"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getProduct } from "@/app/actions/products"
import { addReview } from "@/app/actions/review"

export function OrderProductRating() {
  const [selectedRating, setSelectedRating] = useState<number | null>()
  const [rating, setRating] = useState<number | null>()
  const [review, setReview] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  const open = searchParams.get("rating") !== null
  const productId = searchParams.get("id") as string

  const product = useQuery(["product", productId], () =>
    getProduct(parseInt(productId as string))
  )

  const addReviewMutation = useMutation(() =>
    toast.promise(
      async () =>
        await addReview({
          id: parseInt(productId),
          rating: (rating as number) + 1,
          review: review,
        }),
      {
        pending: "Adding Review",
        success: "Succesfully added review",
        error: "Error",
      }
    )
  )

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.delete("rating")
        newSearchParams.delete("id")
        router.push(`/orders?${newSearchParams.toString()}`)
      }}
    >
      <DialogContent
        open={open}
        className="flex h-3/6 flex-1 flex-col gap-4 lg:h-4/6 lg:w-3/6"
      >
        <DialogHeader title="Give Rating" />
        <div className="flex flex-1 flex-col gap-4 px-6">
          <div className="flex w-full items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border dark:border-gray-800 lg:h-20 lg:w-20">
              <Image
                src={product.data?.images[0].image_url as string}
                alt="product-image"
                fill
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{product.data?.name}</div>
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(" ")
                  .map((value, index) => (
                    <AiFillStar
                      key={index}
                      onMouseOver={() => setRating(index)}
                      onMouseLeave={() => setRating(selectedRating)}
                      onClick={() => setSelectedRating(index)}
                      className={twMerge(
                        clsx(
                          "h-6 w-6 cursor-pointer  text-gray-300 opacity-50",
                          index <= (rating as number) &&
                            "text-yellow-400 opacity-100"
                        )
                      )}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="">
            <textarea
              className="h-40 w-96 rounded-lg border bg-slate-100 px-4 py-2 text-sm"
              onChange={(event) => setReview(event.target.value)}
            />
          </div>
        </div>
        <div className="flex  items-center justify-center py-4">
          <Button
            onClick={() => addReviewMutation.mutate()}
            variant="default"
            className="bg-blue-400 font-medium text-white"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
