import Image from "next/image"
import { FiMapPin } from "react-icons/fi"

import { prisma } from "@/lib/prisma"
import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import ProductCard from "@/components/user/product-card"

import { BaseDataFilters } from "../../../../../types"

const sortOptions: Option[] = [
  { label: "Latest to Oldest", value: "id.desc" },
  { label: "Oldest to Latest", value: "id.asc" },
]

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeSlug: string }
  searchParams: { sort?: string }
}) {
  const productSort: BaseDataFilters["sort"] = {
    [searchParams?.sort?.split(".")[0] as string]: searchParams?.sort?.split(
      "."
    )[1] as "asc" | "desc",
  }

  const store = await prisma.store.findUnique({
    where: { slug: params.storeSlug },
    include: {
      products: {
        orderBy: productSort,
        include: { images: true, categories: true, reviews: true },
      },
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:px-10 lg:py-6">
      <div className="flex items-center rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-28 w-28 rounded-full border border-gray-200 bg-gray-200">
            <Image
              src={store?.profile_image ?? "/"}
              alt="store-profile-image"
              fill
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">{store?.name}</h2>
            <div className="flex items-center gap-2 text-gray-500">
              <FiMapPin size={12} />
              <span className="text-sm ">{store?.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium lg:text-lg">Products</h2>
          <DataSorter sortOptions={sortOptions} />
        </div>
        <div className="grid grid-cols-10 gap-2.5 lg:grid-cols-12 lg:gap-4">
          {store?.products.map((product) => (
            <ProductCard
              key={product.id}
              href={`/${store.slug}/${product.slug}`}
              image={<ProductCard.Image image={product.featured_image_url} />}
              name={<ProductCard.Name name={product.name} />}
              price={<ProductCard.Price price={product.price} />}
              store={<ProductCard.Store name={store.name} />}
              rating={
                <ProductCard.Rating
                  rating={
                    product.reviews.reduce(
                      (current, next) => (current += next.rating),
                      0
                    ) / product.reviews.length
                  }
                  reviewCount={product.reviews.length}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
