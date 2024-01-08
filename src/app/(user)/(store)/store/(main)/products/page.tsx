import { Metadata } from "next"
import invariant from "tiny-invariant"

import { ProductTable } from "@/components/admin/product/product-table"
import { getStore, getStoreProducts } from "@/app/actions/store"

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Products</h1>
      <ProductTable products={products} />
    </div>
  )
}
