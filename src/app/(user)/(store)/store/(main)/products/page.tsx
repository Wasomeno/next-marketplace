import { Metadata } from "next"
import { ProductCount } from "@/modules/user/store/product-page/components/product-count"
import { ProductTable } from "@/modules/user/store/product-page/components/product-table"
import { getServerSession } from "next-auth"
import invariant from "tiny-invariant"

export const metadata: Metadata = {
  title: "My Store Products",
}

export default async function UserStoreProductsPage() {
  const session = await getServerSession()

  invariant(session?.user.email, "Invalid Session")

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
        <ProductCount />
      </div>
      <ProductTable userEmail={session.user.email} />
    </div>
  )
}
