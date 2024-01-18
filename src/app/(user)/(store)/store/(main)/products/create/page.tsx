import React from "react"
import { Metadata } from "next"

import { AddProductForm } from "@/components/admin/product/forms/add-product-form"
import { getCategories } from "@/app/actions/categories"
import { getStore } from "@/app/actions/store/store"

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore()
  return {
    title: `Create Product | ${store?.name}`,
  }
}

export default async function UserStoreProductsCreate() {
  const categories = await getCategories()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium lg:text-2xl">Create Product</h1>
      <div className="flex justify-center">
        <AddProductForm categories={categories} />
      </div>
    </div>
  )
}
