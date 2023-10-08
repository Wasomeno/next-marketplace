import { Metadata } from "next"

import { prisma } from "@/lib/prisma"
import { Products } from "@/components/user/products"

type Props = {
  searchParams: {
    q: string
    pmin: string
    pmax: string
    sort: string
    category: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Search`,
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const priceMin = searchParams.pmin
  const priceMax = searchParams.pmax
  const categoryId = searchParams.category && parseInt(searchParams.category)
  const sort = searchParams.sort ? [searchParams.sort.split(".")] : []

  const products = await prisma.product.findMany({
    where: {
      name: { contains: searchParams.q },
      category_id: categoryId as number,
      price: {
        lte: priceMax ? parseInt(priceMax as string) : 5000000,
        gte: priceMin ? parseInt(priceMin as string) : 100,
      },
    },
    orderBy: !sort.length ? { price: "asc" } : Object.fromEntries(sort as []),

    include: { category: true, images: true },
  })
  return <Products products={products} />
}
