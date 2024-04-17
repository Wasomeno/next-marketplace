import Image from "next/image"

import { prisma } from "@/lib/prisma"
import { Skeleton } from "@/components/skeleton"

export const CategoryHero = async ({
  categorySlug,
}: {
  categorySlug: string
}) => {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { images: true },
  })

  return (
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
