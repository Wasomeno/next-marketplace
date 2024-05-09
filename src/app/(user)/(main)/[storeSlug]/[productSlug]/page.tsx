import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { isProductInWishlist } from "@/actions/user/wishlist"
import {
  AddToCartForm,
  ProductImages,
  ProductReviews,
  WishListButton,
} from "@/modules/user/product-page/components"
import { FiMapPin } from "react-icons/fi"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"

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
      store: true,
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
            <div className="my-4 h-24 space-y-2 lg:h-48">
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
            <Link
              href={`/${product.store.slug}`}
              className="my-4 flex h-10 items-center gap-4"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-100 shadow-sm">
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
        <ProductReviews productId={product.id} />
      </div>
      <AddToCartForm product={product} />
    </div>
  )
}
