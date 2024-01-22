import { Metadata } from "next"
import { split } from "postcss/lib/list"
import invariant from "tiny-invariant"

import { ProductTable } from "@/components/admin/product/product-table"
import { getStore, getStoreProducts } from "@/app/actions/store/store"

type UserStoreProductsProps = {
  searchParams: {
    sort?: string
    search?: string
    categoryId?: string
    status?: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore()
  return {
    title: `Products | ${store?.name}`,
  }
}

export default async function UserStoreProducts(props: UserStoreProductsProps) {
  const { status, search, sort } = props.searchParams
  const sortProduct: Record<string, "asc" | "desc"> = sort
    ? { [sort.split(".")[0]]: sort.split(".")[1] as "asc" | "desc" }
    : { id: "asc" }

  const products = await getStoreProducts({ status, search, sort: sortProduct })

  invariant(products)

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
      <ProductTable products={products} />
    </div>
  )
}
