import { Metadata } from "next"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"
import { BackButton } from "@/components/back-button"
import { AddToCartDialog } from "@/components/user/product-details/add-to-cart-dialog"
import { ProductImages } from "@/components/user/product-details/product-images"
import { WishListButton } from "@/components/user/product-details/wishlist-button"
import { isProductInWishlist } from "@/app/actions/wishlist"

type Props = {
  params: { product: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(params?.product) },
  })
  return {
    title: `${productDetails?.name} | Next Marketplace `,
    description: productDetails?.description,
  }
}

export default async function ProductPage(props: {
  params: { product: string }
}) {
  const { product: productId } = props.params
  const productDetails = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { images: { select: { image_url: true } } },
  })

  const isWishlisted = await isProductInWishlist(parseInt(productId))

  invariant(productDetails, "Type error")

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full justify-start px-2">
        <BackButton size="18" text="Back" />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-10 lg:w-5/6 lg:flex-nowrap">
        <ProductImages
          imageUrls={productDetails?.images.map((image) => image.image_url)}
        />
        <div className="w-10/12 lg:w-5/12">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-medium lg:text-xl">
              {productDetails?.name}
            </h1>
            <WishListButton isWishlisted={isWishlisted} />
          </div>
          <div className="my-4 text-lg font-medium lg:text-3xl">
            Rp. {productDetails?.price.toLocaleString("id")}
          </div>
          <Separator
            decorative
            orientation="horizontal"
            className="my-2 w-full bg-slate-200 dark:bg-gray-800"
            style={{ height: "1px" }}
          />
          <span className="text-sm font-medium lg:text-base">Description</span>
          <Separator
            decorative
            orientation="horizontal"
            className="my-2 w-full bg-slate-200 dark:bg-gray-800"
            style={{ height: "1px" }}
          />
          <div>
            <p className="text-sm font-light lg:text-base">
              {productDetails?.description}
            </p>
          </div>
        </div>
        <AddToCartDialog productDetails={productDetails} />
      </div>
    </div>
  )
}
