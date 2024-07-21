import { Metadata } from "next"
import { Suspense } from "react"

import { prisma } from "@/lib/prisma"

import { CategoryHero, CategoryHeroSkeleton } from "./_components/category-hero"
import { CategoryProducts } from "./_components/category-products"

type Props = {
  params: { category: string }
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

export default function CategoryProductsPage({ params }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <Suspense fallback={<CategoryHeroSkeleton />}>
        <CategoryHero categorySlug={params.category} />
      </Suspense>
      <CategoryProducts />
    </div>
  )
}
