import { Metadata } from "next"
import invariant from "tiny-invariant"

import { ProductTable } from "@/components/admin/product/product-table"
import { getStore, getStoreProducts } from "@/app/actions/store/store"

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore()
  return {
    title: `Products | ${store?.name}`,
  }
}

export default async function UserStoreProducts() {
  const products = await getStoreProducts()

  invariant(products)

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
      <ProductTable products={products} />
    </div>
  )
}
