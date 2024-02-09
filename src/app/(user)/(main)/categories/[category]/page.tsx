import { Metadata } from "next"
import Image from "next/image"

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
    include: { images: true },
  })

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center gap-6 bg-gradient-to-r from-blue-300 to-sky-100 px-6 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
        <div className="relative h-24 w-24 overflow-hidden  rounded-full  shadow-md lg:h-36 lg:w-36">
          <Image
            src={category?.images[0].url as string}
            alt={category?.images[0].name as string}
            fill
          />
        </div>
        <div className="space-y-1 lg:space-y-2">
          <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
            {category?.name}
          </h2>
          <p className="text-ellipsis text-sm tracking-wide lg:text-base">
            {category?.description}
          </p>
        </div>
      </div>
      <Products />
    </div>
  )
}
