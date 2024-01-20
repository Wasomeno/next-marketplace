"use client"

import { Prisma } from "@prisma/client"
import { RxCrossCircled } from "react-icons/rx"

import ProductCard from "@/components/user/product-card"

import { ProductsFilter } from "../product-filter"
import { ProductSorter } from "./product-sorter"

type ProductsSectionProps = {
  products:
    | Prisma.ProductGetPayload<{
        include: { categories: true; images: true; store: true; reviews: true }
      }>[]
    | undefined
}

export function Products({ products }: ProductsSectionProps) {
  return (
    <div className="relative flex w-full flex-1 justify-center gap-10 px-4 lg:px-10">
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h6 className="text-sm font-medium lg:text-lg">Products</h6>
          <div className="flex items-center gap-2">
            <ProductSorter />
            <ProductsFilter />
          </div>
        </div>
        <div className="grid grid-cols-10 gap-4 lg:grid-cols-12">
          {products?.length !== 0 &&
            products?.map((product) => (
              <ProductCard
                key={product.id}
                href={`/${product.id}`}
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
          {products?.length === 0 && (
            <div className="col-span-12 flex h-96 flex-col items-center justify-center gap-2">
              <span className="text-sm text-slate-800  text-opacity-50 lg:text-base dark:text-gray-500">
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
