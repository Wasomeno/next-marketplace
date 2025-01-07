"use client"

import { useParams } from "next/navigation"
import { RxCrossCircled } from "react-icons/rx"

import { getProducts } from "@/actions/product"
import ProductCard from "@/components/product-card"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { TBaseDataFilterParams } from "../../../../../../../types"
import { DataSorter } from "../../../../../../components/data-sorter"
import { Option } from "../../../../../../components/dropdown"
import { ProductsFilter } from "../../../../../../components/product-filter"

const sortOptions: Option[] = [
  {
    label: "Price low to high",
    value: "price.asc",
  },
  {
    label: "Price high to low",
    value: "price.desc",
  },
  {
    label: "Name from A to Z",
    value: "name.asc",
  },
  {
    label: "Name from Z to A",
    value: "name.desc",
  },
]

export function CategoryProducts() {
  const params = useParams()

  const searchParamsValues = useSearchParamsValues<
    TBaseDataFilterParams & { q: string }
  >()

  const products = useQuery({
    queryKey: ["products", searchParamsValues, params.category],
    queryFn: () =>
      getProducts({
        ...searchParamsValues,
        sort: getParsedSortParams(searchParamsValues.sort),
        categorySlug: params.category as string,
      }),
  })

  const isProductsExist = products?.data?.length !== 0 && !products.isLoading

  return (
    <div className="relative flex w-full flex-1 justify-center gap-10 px-4 lg:px-24">
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between px-4">
          <h6 className="text-sm font-medium lg:text-xl">
            {products.data?.length} Results
          </h6>
          <div className="flex items-center gap-2">
            <DataSorter sortOptions={sortOptions} />
            <ProductsFilter withCategories />
          </div>
        </div>
        <div className="grid grid-cols-10 lg:grid-cols-12">
          {products.isLoading &&
            Array.from({ length: 16 }).map((_, index) => (
              <ProductCard.Skeleton key={index} />
            ))}

          {isProductsExist &&
            products?.data?.map((product) => (
              <ProductCard
                key={product.id}
                href={`/${product.store.slug}/${product.slug}`}
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
                    rating={0}
                    reviewCount={product.reviews.length}
                  />
                }
              />
            ))}

          {!isProductsExist && (
            <div className="col-span-12 flex h-96 flex-col items-center justify-center gap-2">
              <span className="text-sm text-slate-800  text-opacity-50 dark:text-gray-500 lg:text-base">
                No products found
              </span>
              <span className="text-slate-800 text-opacity-50 dark:text-gray-500">
                <RxCrossCircled className="h-6 w-6 lg:h-8 lg:w-8" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
