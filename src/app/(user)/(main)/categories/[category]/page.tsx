import { Metadata } from "next"

import { prisma } from "@/lib/prisma"
import { ProductsSection } from "@/components/products-section"

type Props = {
  params: { category: string }
  searchParams: { pmin: string; pmax: string; sort: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  })
  return {
    title: `${category?.name} | Next Marketplace`,
    description: category?.description,
  }
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: Props) {
  const priceMin = searchParams.pmin
  const priceMax = searchParams.pmax
  const sort = searchParams.sort ? [searchParams.sort.split(".")] : []

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      products: {
        orderBy: !sort.length ? { price: "asc" } : Object.fromEntries(sort),
        where: {
          price: {
            lte: priceMax ? parseInt(priceMax) : 50000000,
            gte: priceMin ? parseInt(priceMin) : 100,
          },
        },
        include: { images: true, category: true, reviews: true },
      },
    },
  })

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between bg-slate-100 px-10 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          {category?.name}
        </h2>
      </div>
      <ProductsSection products={category?.products} />
    </div>
  )
}
