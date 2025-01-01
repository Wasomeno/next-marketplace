import { Metadata } from "next"
import { Suspense } from "react"

import { prisma } from "@/lib/prisma"

import { TPageProps } from "../../../../../../types"
import { CategoryHero, CategoryHeroSkeleton } from "./_components/category-hero"
import { CategoryProducts } from "./_components/category-products"

export async function generateMetadata({
  params,
}: TPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })
  return {
    title: `${category?.name} | Next Marketplace`,
    description: category?.description,
  }
}

export default async function CategoryProductsPage({ params }: TPageProps) {
  const { category: categorySlug } = await params
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <Suspense fallback={<CategoryHeroSkeleton />}>
        <CategoryHero categorySlug={categorySlug} />
      </Suspense>
      <CategoryProducts />
    </div>
  )
}
