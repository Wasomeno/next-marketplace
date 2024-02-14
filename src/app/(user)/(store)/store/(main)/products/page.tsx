import { ProductTable } from "@/components/admin/product/product-table"

export default function UserStoreProducts() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
      <ProductTable />
    </div>
  )
}
