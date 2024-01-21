import { Metadata } from "next"
import { BiSolidStar } from "react-icons/bi"
import { RiChatDeleteFill } from "react-icons/ri"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"
import { AddToCartForm } from "@/components/user/product-details/add-to-cart-form"
import { ProductImages } from "@/components/user/product-details/product-images"
import { ReviewCard } from "@/components/user/product-details/review-card"
import { WishListButton } from "@/components/user/product-details/wishlist-button"
import { isProductInWishlist } from "@/app/actions/user/wishlist"

type Props = {
  params: { productId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(params?.productId) },
  })
  return {
    title: `${productDetails?.name} | Next Marketplace `,
    description: productDetails?.description,
  }
}

export default async function ProductPage(props: {
  params: { productId: string }
}) {
  const { productId } = props.params
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: {
      images: { select: { url: true } },
      reviews: { include: { user: true } },
    },
  })

  const isWishlisted = await isProductInWishlist(parseInt(productId))

  invariant(productDetails, "Type error")

  return (
    <div className="relative flex flex-1 flex-col gap-10 lg:flex-row">
      <div className="mx-5 flex-1 space-y-10 lg:ml-20 lg:mr-0">
        <div className="flex flex-1 flex-wrap justify-center gap-10 lg:flex-nowrap lg:justify-normal">
          <div className="w-full lg:w-80">
            <ProductImages
              imageUrls={productDetails?.images.map((image) => image.url)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-base font-medium lg:text-xl">
                {productDetails?.name}
              </h1>
              <WishListButton isWishlisted={isWishlisted} />
            </div>
            <div className="mb-4 text-lg font-medium lg:text-2xl">
              Rp {productDetails?.price.toLocaleString("id")}
            </div>
            <Separator
              decorative
              orientation="horizontal"
              className="w-full bg-slate-200 dark:bg-gray-800"
              style={{ height: "1px" }}
            />
            <div className="my-4 space-y-2">
              <span className="text-sm font-medium lg:text-base">
                Description
              </span>
              <p className="text-sm font-light lg:text-sm">
                {productDetails?.description}
              </p>
            </div>
            <Separator
              decorative
              orientation="horizontal"
              className="w-full bg-slate-200 dark:bg-gray-800"
              style={{ height: "1px" }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:justify-normal lg:gap-10">
          <div className="w-full space-y-2 lg:w-80 lg:space-y-4">
            <h2 className="text-base font-medium lg:text-lg">Overall Rating</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-3xl lg:text-5xl">
                <BiSolidStar className="h-6 w-6 text-yellow-400 lg:h-8 lg:w-8" />
                {productDetails.reviews.length === 0
                  ? 0
                  : productDetails.reviews.reduce(
                      (ratingSum, nextReview) => ratingSum + nextReview.rating,
                      0
                    ) / productDetails.reviews.length}{" "}
                <span className="text-xl lg:text-3xl">/ 5</span>
              </div>
              <span className="text-sm opacity-50">
                {productDetails.reviews.length} reviews
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col space-y-2 lg:space-y-4">
            <h2 className="text-base font-medium lg:text-lg">Reviews</h2>
            {productDetails.reviews.length > 0 && (
              <div className="flex flex-1 flex-col gap-4">
                {productDetails.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
            {productDetails.reviews.length === 0 && (
              <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border text-gray-400">
                <RiChatDeleteFill size={20} />
                <span className="text-sm">No Reviews</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddToCartForm productDetails={productDetails} />
    </div>
  )
}
