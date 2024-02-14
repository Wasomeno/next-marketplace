"use client"

import { useParams } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import { getStoreProducts } from "@/app/actions/store/store"

import { BaseDataFilters } from "../../../../types"
import ProductCard from "../product-card"

const sortOptions: Option[] = [
  { label: "Latest to Oldest", value: "id.desc" },
  { label: "Oldest to Latest", value: "id.asc" },
]

export function StoreProducts() {
  const params = useParams()

  const searchParamsValues = useSearchParamsValues<BaseDataFilters>()
  const { data: products, isLoading } = useQuery({
    queryKey: ["storeProducts", params?.storeSlug, searchParamsValues],
    queryFn: () =>
      getStoreProducts({
        ...searchParamsValues,
        slug: params?.storeSlug as string,
      }),
  })

  const productSkeletons = Array(6).fill(<ProductCard.Skeleton />)

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-medium lg:text-lg">Products</h2>
        <DataSorter sortOptions={sortOptions} />
      </div>
      <div className="grid grid-cols-10 gap-2.5 lg:grid-cols-12 lg:gap-4">
        {isLoading && productSkeletons}
        {!isLoading &&
          products?.map((product) => (
            <ProductCard
              key={product.id}
              href={`/${params?.storeSlug}/${product.slug}`}
              image={<ProductCard.Image image={product.featured_image_url} />}
              name={<ProductCard.Name name={product.name} />}
              price={<ProductCard.Price price={product.price} />}
              store={<ProductCard.Store name={product.store.name} />}
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
    </>
  )
}
