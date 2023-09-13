import { AddProductModal } from "@/components/admin/product/modals/add-product-modal"
import { EditProductModal } from "@/components/admin/product/modals/edit-product-modal"
import { ViewProductDetailsModal } from "@/components/admin/product/modals/view-product-details-modal"
import { ProductsTable } from "@/components/admin/product/products-table"
import { getAllProducts } from "@/app/actions/products"

export const metadata = {
  title: "Admin | Products",
}

export default async function AdminProductsPage() {
  const products = await getAllProducts()
  return (
    <div className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Products
        </h1>
      </div>
      <ProductsTable products={products} />
      <AddProductModal />
      <ViewProductDetailsModal />
      <EditProductModal />
    </div>
  )
}
