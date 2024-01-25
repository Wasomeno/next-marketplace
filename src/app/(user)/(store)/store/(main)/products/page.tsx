"use client"

import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { queryClient } from "@/lib/react-query-client"
import { ProductTable } from "@/components/admin/product/product-table"
import { getStoreProducts } from "@/app/actions/store/store"

type UserStoreProductsProps = {
  searchParams: {
    sort?: string
    search?: string
    categoryId?: string
    status?: string
  }
}

export default function UserStoreProducts(props: UserStoreProductsProps) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductTable />
      </HydrationBoundary>
    </div>
  )
}
