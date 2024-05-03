import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/actions/store/user"
import { getUserStore } from "@/actions/user/user-details"
import { CreateProductModal } from "@/modules/user/store/product-page/components/create-product-modal"
import { EditProductModal } from "@/modules/user/store/product-page/components/edit-product-modal"
import { ProductCount } from "@/modules/user/store/product-page/components/product-count"
import { ProductTable } from "@/modules/user/store/product-page/components/product-table"

export const metadata: Metadata = {
  title: "My Store Products",
}

export default async function UserStoreProductsPage() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await getUserStore({ userEmail: session.user.email })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
        <ProductCount storeId={store.id} />
      </div>
      <ProductTable storeId={store.id} />
      <CreateProductModal storeId={store.id} />
      <EditProductModal storeId={store.id} />
    </div>
  )
}
