import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { HiChevronRight } from "react-icons/hi2"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Categories",
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { image: true },
  })

  invariant(categories)

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex h-36 w-full items-center justify-between bg-gradient-to-r from-blue-300 to-sky-100 px-6 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
        <h2 className="text-lg font-medium tracking-wider lg:text-4xl">
          Categories
        </h2>
      </div>
      <div className="mt-4 grid w-full grid-cols-12 gap-2 px-4 lg:px-10">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="col-span-6 flex h-40 flex-col gap-2 rounded-md border bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-slate-950 lg:col-span-2 lg:h-52 lg:text-base"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium lg:text-base ">
                {category.name}
              </span>
              <HiChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>

            <div className="relative h-5/6 w-full">
              <Image
                fill
                src={category.image?.url ?? ""}
                className="rounded-md"
                alt="category-image"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
