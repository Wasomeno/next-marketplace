import { Metadata } from "next"
import invariant from "tiny-invariant"

import { isProductInWishlist } from "@/actions/user/wishlist"
import { prisma } from "@/lib/prisma"

import { TPageProps } from "../../../../../../types"
import { ProductClientPage } from "./_components/product-client-page"

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

  const isWishlisted = await isProductInWishlist(product?.id as number)

  invariant(product, "Type error")

  return <ProductClientPage isWishlisted={isWishlisted} product={product} />
}
