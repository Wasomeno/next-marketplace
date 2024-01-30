import { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { queryClient } from "@/lib/react-query-client"
import { ProductTable } from "@/components/admin/product/product-table"
import { getStore, getStoreProducts } from "@/app/actions/store/store"

type UserStoreProductsProps = {
  searchParams: {
    sort?: string
    search?: string
    categoryId?: string
    status?: string
    page?: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore()
  return {
    title: `Products | ${store?.name}`,
  }
}

export default async function UserStoreProducts(props: UserStoreProductsProps) {
  const { status, search, sort, page } = props.searchParams
  const sortProduct: Record<string, "asc" | "desc"> = sort
    ? { [sort.split(".")[0]]: sort.split(".")[1] as "asc" | "desc" }
    : { id: "asc" }

  await queryClient.prefetchQuery({
    queryKey: ["products", page, search, sort, status],
    queryFn: () =>
      getStoreProducts({
        page: parseInt(page as string),
        status,
        pageSize: 3,
        search,
        sort: sortProduct,
      }),
  })

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductTable />
      </HydrationBoundary>
    </div>
  )
}
