import { Metadata } from "next"

import { prisma } from "@/lib/prisma"
import { Products } from "@/components/user/products"

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

export default async function CategoryProductsPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  })

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center justify-between bg-slate-100 px-10 lg:h-72 lg:px-16 dark:bg-neutral-900 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          {category?.name}
        </h2>
      </div>
      <Products />
    </div>
  )
}
