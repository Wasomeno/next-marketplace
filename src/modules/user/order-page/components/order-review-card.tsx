"use client"

import React from "react"
import Image from "next/image"
import { createProductReview } from "@/actions/store/review"
import { zodResolver } from "@hookform/resolvers/zod"
import { Prisma } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { FaStar } from "react-icons/fa"
import { ImCheckmark, ImSpinner8 } from "react-icons/im"
import { IoCheckmarkCircle } from "react-icons/io5"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"

const reviewFormDataSchema = z.object({
  rating: z.number().min(1, "Give a rating"),
  title: z.string().min(5, "Title must have at least 5 characters"),
  description: z
    .string()
    .min(10, "Description must have at least 10 characters"),
})

type ReviewFormData = z.infer<typeof reviewFormDataSchema>

export const OrderReviewCard: React.FC<{
  userEmail: string
  orderProduct: Prisma.OrderProductGetPayload<{
    include: { product: true }
  }>
}> = ({ userEmail, orderProduct }) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormDataSchema),
  })

  const rating = form.watch("rating")

  function setRating(index: number) {
    form.setValue("rating", index + 1)
  }

  const createReviewMutation = useMutation({
    mutationFn: async (formData: ReviewFormData) =>
      await createProductReview({
        userEmail,
        orderProductId: orderProduct.id,
        productId: orderProduct.product_id,
        rating: formData.rating,
        review: formData.description,
        title: formData.title,
      }),
    onSuccess: () => toast.success("Succesfully added product review"),
    onError: () => toast.error("Error when adding product review"),
  })
  return (
    <div className="space-y-2 border-b p-2">
      <div className="flex flex-1 gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border lg:h-24 lg:w-24">
          <Image
            src={orderProduct.product.featured_image_url}
            fill
            alt={orderProduct.product.name}
          />
        </div>
        <div className="flex flex-1 flex-col justify-between lg:flex-row">
          <span className="inline w-full text-xs lg:w-fit lg:text-sm">
            {orderProduct.product.name}
          </span>
        </div>
      </div>
      {!orderProduct.isReviewed && (
        <form
          onSubmit={form.handleSubmit((formData) =>
            createReviewMutation.mutate(formData)
          )}
          className="flex flex-1 flex-col space-y-4"
        >
          <div className="flex flex-1 flex-col gap-4">
            <Fieldset label="Rating">
              <div className="flex items-center gap-2">
                {Array(5)
                  .fill("")
                  .map((_, index) => (
                    <FaStar
                      key={index}
                      onClick={() => setRating(index)}
                      className={twMerge(
                        clsx(
                          "h-6 w-6 cursor-pointer text-gray-300",
                          index < rating && "text-yellow-400"
                        )
                      )}
                    />
                  ))}
              </div>
            </Fieldset>
            <Fieldset label="Title">
              <Input
                placeholder="Input review title"
                {...form.register("title")}
              />
            </Fieldset>
            <Fieldset label="Description">
              <TextArea
                placeholder="Input review description"
                className="h-32"
                {...form.register("description")}
              />
            </Fieldset>
          </div>
          <div className="flex flex-col justify-end gap-2 lg:flex lg:flex-row">
            <Button
              disabled={createReviewMutation.isPending}
              size="sm"
              className="w-full lg:w-24 lg:text-xs"
            >
              {createReviewMutation.isPending && (
                <ImSpinner8 className="animate-spoin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      )}
      {orderProduct.isReviewed && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-400">Review Submitted</span>
          <IoCheckmarkCircle className="h-5 w-5 text-green-600" />
        </div>
      )}
    </div>
  )
}
