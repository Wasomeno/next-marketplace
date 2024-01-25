"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { AiFillStar } from "react-icons/ai"
import { BiStore } from "react-icons/bi"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { getProduct } from "@/app/actions/product"
import { addReview } from "@/app/actions/store/review"

export function OrderProductRating() {
  const [selectedRating, setSelectedRating] = useState<number | null>()
  const [rating, setRating] = useState<number | null>()
  const [review, setReview] = useState("")

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const open = searchParams.get("rating") !== null
  const productId = searchParams.get("productId") as string
  const orderProductId = searchParams.get("orderProductId") as string

  const product = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(parseInt(productId as string)),
  })

  async function addProductReview() {
    toast.promise(
      async () =>
        await addReview({
          orderProductId: parseInt(orderProductId),
          productId: parseInt(productId),
          rating: (rating as number) + 1,
          review: review,
        }),
      {
        pending: "Adding Review",
        success: "Succesfully added review",
        error: "Error",
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={() => router.push(pathname)}>
      <DialogContent
        open={open}
        className="flex h-3/6 flex-1 flex-col gap-4 lg:h-4/6 lg:w-3/6"
      >
        <DialogHeader title="Give your review" />
        <div className="flex flex-1 flex-col gap-4 px-6">
          <div className="flex w-full items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border lg:h-24 lg:w-24 dark:border-gray-800">
              <Image
                src={product.data?.featured_image_url as string}
                alt="product-image"
                fill
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{product.data?.name}</div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <BiStore size={18} /> {product.data?.store.name}
              </div>
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
          <form className="flex flex-col gap-2">
            <Fieldset label="Title">
              <Input
                type="text"
                placeholder="Input your review title"
                onChange={(event) => setReview(event.target.value)}
              />
            </Fieldset>
            <Fieldset label="Review">
              <TextArea
                placeholder="Input your review details"
                className="h-40"
                onChange={(event) => setReview(event.target.value)}
              />
            </Fieldset>
          </form>
        </div>
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            onClick={() => router.push(pathname)}
            variant="danger"
            className="font-medium text-white"
          >
            No Thanks
          </Button>
          <Button
            onClick={addProductReview}
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
