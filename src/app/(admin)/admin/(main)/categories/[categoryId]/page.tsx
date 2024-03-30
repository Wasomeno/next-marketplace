import { Metadata } from "next"
import Image from "next/image"
import invariant from "tiny-invariant"

import { getCategory } from "@/app/actions/categories"

export async function generateMetadata({
  params,
}: {
  params: { categoryId: string }
}): Promise<Metadata> {
  const category = await getCategory(Number(params.categoryId))
  return {
    title: `${category?.name} | Next Marketplace Category`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string }
}) {
  const category = await getCategory(Number(params.categoryId))

  invariant(category, "Category Invalid")

  fetch("https://api.rajaongkir.com/starter/province?id=12", {
    method: "GET",
    headers: {
      key: "e936e01df5dd09b75d17752ff1fcb2df",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((result) => console.log(result))

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-6">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          {category.name}
        </h1>
      </div>
      <Image
        src={category.images[0].url}
        alt={category.images[0].name}
        width={300}
        height={300}
        className="rounded-lg border border-gray-200 shadow-sm"
      />
    </div>
  )
}
