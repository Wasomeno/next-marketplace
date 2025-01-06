import Image from "next/image"

import { Skeleton } from "@/components/skeleton"
import { prisma } from "@/lib/prisma"

export const CategoryHero = async ({
  categorySlug,
}: {
  categorySlug: string
}) => {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { image: true },
  })

  return (
    <div className="flex h-36 w-full items-center gap-10 bg-gray-100 px-6 dark:bg-neutral-900 lg:h-72 lg:px-28">
      <div className="space-y-1 lg:space-y-2">
        <h2 className="text-lg font-bold lg:text-4xl">{category?.name}</h2>
        <p className="text-ellipsis text-sm lg:text-base text-muted-foreground">
          {category?.description}
        </p>
      </div>
    </div>
  )
}

export const CategoryHeroSkeleton = () => {
  return (
    <div className="flex h-36 w-full items-center gap-6 bg-gradient-to-r from-blue-300 to-sky-100 px-6 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
      <Skeleton className=" h-24 w-24  rounded-full  lg:h-36 lg:w-36" />
      <div className="space-y-1 lg:space-y-2">
        <Skeleton className="h-[22px] lg:h-[38px]" />
        <Skeleton className="h-[16px] w-40 tracking-wide lg:h-[18px]" />
      </div>
    </div>
  )
}
