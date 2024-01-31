import { Suspense } from "react"
import { Metadata } from "next"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"
import { AddToCartForm } from "@/components/user/product-details/add-to-cart-form"
import { ProductImages } from "@/components/user/product-details/product-images"
import { ProductReviews } from "@/components/user/product-details/product-reviews"
import { WishListButton } from "@/components/user/product-details/wishlist-button"
import { isProductInWishlist } from "@/app/actions/user/wishlist"

type Props = {
  params: { productSlug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params?.productSlug },
  })
  return {
    title: `${product?.name} | Next Marketplace `,
    description: product?.description,
  }
}

export default async function ProductPage(props: {
  params: { productSlug: string }
}) {
  const { productSlug } = props.params
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      images: { select: { url: true } },
      reviews: { include: { user: true } },
    },
  })

  const isWishlisted = await isProductInWishlist(product?.id as number)

  invariant(product, "Type error")

  return (
    <div className="relative flex flex-1 flex-col gap-10 lg:flex-row">
      <div className="mx-5 flex-1 space-y-10 lg:ml-20 lg:mr-0">
        <div className="flex flex-1 flex-wrap justify-center gap-10 lg:flex-nowrap lg:justify-normal">
          <div className="w-full lg:w-80">
            <ProductImages
              imageUrls={product?.images.map((image) => image.url)}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-base font-medium lg:text-xl">
                {product?.name}
              </h1>
              <WishListButton isWishlisted={isWishlisted} />
            </div>
            <div className="mb-4 text-lg font-medium lg:text-2xl">
              Rp {product?.price.toLocaleString("id")}
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
                {product?.description}
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
        <Suspense fallback={<div>Test Fallback reviews</div>}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </div>
      <AddToCartForm product={product} />
    </div>
  )
}
