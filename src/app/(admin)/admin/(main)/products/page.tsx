import { AddProductModal } from "@/components/admin/product/modals/add-product-modal"
import { ProductDetailsModal } from "@/components/admin/product/modals/product-details-modal"
import { ProductEditModal } from "@/components/admin/product/modals/product-edit-modal"
import { ProductsTable } from "@/components/admin/product/products-table"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { getAllProducts } from "@/app/actions/products"

export const metadata = {
  title: "Admin | Products",
}

export default async function AdminProductsPage() {
  const products = await getAllProducts()
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Products
        </h1>
      </div>
      <ProductsTable products={products} />
      <AddProductModal />
      <ProductDetailsModal />
      <ProductEditModal />
    </PageTransitionWrapper>
  )
}
