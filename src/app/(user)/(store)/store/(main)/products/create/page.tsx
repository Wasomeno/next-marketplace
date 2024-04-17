import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/actions/categories"
import { StoreProductCreateForm } from "@/modules/user/store/product-page/components/store-product-create-form"

export const metadata: Metadata = {
  title: `Create Store Product`,
}

export default async function UserStoreProductCreatePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Create Product</h1>
      <div className="flex justify-center">
        <StoreProductCreateForm />
      </div>
    </div>
  )
}
