import { Suspense } from "react"
import { Metadata } from "next"
import Image from "next/image"

import { prisma } from "@/lib/prisma"
import {
  CategoryDetailsSection,
  CategoryDetailsSectionSkeleton,
} from "@/components/user/category/category-details-section"
import { Products } from "@/components/user/products"

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
      <Suspense fallback={<CategoryDetailsSectionSkeleton />}>
        <CategoryDetailsSection categorySlug={params.category} />
      </Suspense>
      <Products />
    </div>
  )
}
