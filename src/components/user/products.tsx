"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { RxCrossCircled } from "react-icons/rx"

import ProductCard from "@/components/user/product-card"
import { getProducts } from "@/app/actions/product"

import { BaseDataFilters } from "../../../types"
import { DataSorter } from "../data-sorter"
import { Option } from "../dropdown"
import { ProductsFilter } from "../product-filter"

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

export function Products() {
  const params = useParams()

  const searchParamsValues = useSearchParamsValues<
    BaseDataFilters & { q: string }
  >()

  const products = useQuery({
    queryKey: ["products", searchParamsValues, params.category],
    queryFn: () =>
      getProducts({
        ...searchParamsValues,
        categorySlug: params.category as string,
      }),
  })

  const ProductsExist = products?.data?.length !== 0 && !products.isLoading
  const ProductNotExist =
    (products?.data?.length as number) < 1 && !products.isLoading

  return (
    <div className="relative flex w-full flex-1 justify-center gap-10 px-4 lg:px-10">
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h6 className="text-sm font-medium lg:text-lg">Products</h6>
          <div className="flex items-center gap-2">
            <DataSorter sortOptions={sortOptions} />
            <ProductsFilter withCategories />
          </div>
        </div>
        <div className="grid grid-cols-10 gap-4 lg:grid-cols-12">
          {products.isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCard.Skeleton key={index} />
            ))}

          {ProductsExist &&
            products?.data?.map((product) => (
              <ProductCard
                key={product.id}
                href={`/${product.store.slug}/${product.slug}`}
                image={<ProductCard.Image image={product.featured_image_url} />}
                name={<ProductCard.Name name={product.name} />}
                price={<ProductCard.Price price={product.price} />}
                store={<ProductCard.Store name={product.store.name} />}
                rating={
                  <ProductCard.Rating
                    rating={0}
                    reviewCount={product.reviews.length}
                  />
                }
              />
            ))}

          {ProductNotExist && (
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
