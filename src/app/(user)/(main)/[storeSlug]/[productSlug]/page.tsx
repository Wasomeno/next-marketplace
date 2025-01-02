import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FiMapPin } from "react-icons/fi"
import invariant from "tiny-invariant"

import { isProductInWishlist } from "@/actions/user/wishlist"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/prisma"

import { getProductReviews } from "@/actions/product"
import { BiSolidStar } from "react-icons/bi"
import { TPageProps } from "../../../../../../types"
import {
  AddToCartForm,
  ProductImages,
  ProductReviews,
  WishListButton,
} from "./_components"

export async function generateMetadata({
  params,
}: TPageProps): Promise<Metadata> {
  const { productSlug } = await params
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
  })
  return {
    title: `${product?.name} | Next Marketplace `,
    description: product?.description,
  }
}

export default async function ProductPage({ params }: TPageProps) {
  const { productSlug } = await params
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      store: true,
      images: { select: { url: true } },
      reviews: { include: { user: true } },
    },
  })

  const reviews = await getProductReviews(product?.id as number)

  const isWishlisted = await isProductInWishlist(product?.id as number)

  invariant(product, "Type error")

  return (
    <div className="relative flex flex-1 flex-col gap-10 lg:flex-row">
      <div className="flex-1 space-y-10 mx-24 my-4">
        <div className="flex flex-1 flex-wrap justify-center gap-10 lg:flex-nowrap lg:justify-normal">
          <div className="w-full lg:w-[45rem]">
            <ProductImages
              imageUrls={product?.images.map((image) => image.url)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-base font-semibold lg:text-3xl">
                {product?.name}
              </h1>
              <WishListButton isWishlisted={isWishlisted} />
            </div>
            <div className="mb-6 text-lg font-medium lg:text-2xl text-slate-600">
              Rp {product?.price.toLocaleString("id")}
            </div>
            <div className="flex mb-6 items-center gap-4">
              <div className="flex items-center gap-1">
                <BiSolidStar className="h-6 w-6 text-yellow-400 lg:h-5 lg:w-5" />
                <span className="text-slate-500">
                  {reviews.length === 0
                    ? 0
                    : reviews.reduce(
                        (ratingSum, nextReview) =>
                          ratingSum + nextReview.rating,
                        0
                      ) / reviews.length}{" "}
                  / 5
                </span>
              </div>
              <Separator
                decorative
                orientation="vertical"
                className="hidden h-6 w-px bg-gray-200 lg:inline-block"
              />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">{reviews.length} Reviews</span>
              </div>
              <Separator
                decorative
                orientation="vertical"
                className="hidden h-6 w-px bg-gray-200 lg:inline-block"
              />
              <div className="flex items-center gap-1">
                <Link
                  href={`/${product.store.slug}`}
                  className="flex h-10 items-center gap-4"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100 shadow-sm">
                    <Image
                      src={product.store.profile_image}
                      alt="store-profile-image"
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {product.store.name}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiMapPin className="h-3.5 w-3.5" />
                      <span className="text-sm">{product.store.location}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <AddToCartForm product={product} />
            <div className="space-y-2">
              <h2 className="text-sm font-medium lg:text-xl">Description</h2>
              <p className="text-sm font-light lg:text-base">
                {product?.description}
              </p>
            </div>
          </div>
        </div>
        <ProductReviews productId={product.id} />
      </div>
    </div>
  )
}
