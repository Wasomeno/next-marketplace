import { AddProductModal } from "@/components/admin/product/modals/add-product-modal"
import { EditProductModal } from "@/components/admin/product/modals/edit-product-modal"
import { ViewProductModal } from "@/components/admin/product/modals/view-product-modal"
import { ProductTable } from "@/components/admin/product/product-table"
import { getProducts } from "@/app/actions/products"

export const metadata = {
  title: "Admin | Products",
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  return (
    <div className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Products
        </h1>
      </div>
      <ProductTable products={products} />
      <AddProductModal />
      <ViewProductModal />
      <EditProductModal />
    </div>
  )
}
