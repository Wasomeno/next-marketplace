"use client"

import { useParams } from "next/navigation"

import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { getStoreProducts } from "@/app/(user)/(store)/store/_actions"
import { storeQueryKeys } from "@/app/(user)/(store)/store/_query/keys"
import { TBaseDataFilterParams } from "../../../../../../types"
import ProductCard from "../../../../../components/product-card"

const sortOptions: Option[] = [
  { label: "Latest to Oldest", value: "id.desc" },
  { label: "Oldest to Latest", value: "id.asc" },
]

export function StoreProducts() {
  const params = useParams()

  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()
  const products = useQuery({
    queryKey: storeQueryKeys.products({
      ...searchParamsValues,
      storeSlug: params.storeSlug as string,
      sort: getParsedSortParams(searchParamsValues.sort),
    }).key,
    queryFn: () =>
      getStoreProducts({
        ...searchParamsValues,
        sort: getParsedSortParams(searchParamsValues.sort),
        slug: params?.storeSlug as string,
        pageSize: "10",
      }),
  })

  const productSkeletons = Array(16).fill(<ProductCard.Skeleton />)

  return (
    <>
      <div className="flex items-center justify-between px-4">
        <h2 className="font-medium lg:text-lg">Products</h2>
        <DataSorter sortOptions={sortOptions} />
      </div>
      <div className="grid grid-cols-10 lg:grid-cols-12">
        {products.isLoading && productSkeletons}
        {!products.isLoading &&
          products?.data?.products.map((product) => (
            <ProductCard
              key={product.id}
              href={`/${params?.storeSlug}/${product.slug}`}
              image={<ProductCard.Image image={product.featured_image_url} />}
              name={<ProductCard.Name name={product.name} />}
              price={<ProductCard.Price price={product.price} />}
              store={
                <ProductCard.Store
                  name={product.store.name}
                  slug={product.store.slug}
                />
              }
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
