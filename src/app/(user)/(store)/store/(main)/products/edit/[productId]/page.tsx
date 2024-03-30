import React from "react"
import { Metadata } from "next"
import { BiCheck } from "react-icons/bi"
import invariant from "tiny-invariant"

import { EditProductForm } from "@/components/user/store/product/forms/edit-product-form"
import { getCategories } from "@/app/actions/categories"
import { getProduct } from "@/app/actions/product"

type ProductPageProps = {
  params: { productId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(parseInt(params.productId))
  return {
    title: `${product?.name} | Product Details`,
    description: `Details about product ${product?.name}`,
  }
}

export default async function UserStoreProductEditPage({
  params,
}: ProductPageProps) {
  const product = await getProduct(parseInt(params.productId))
  const categories = await getCategories()

  invariant(product)

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Edit Product</h1>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600">
            <BiCheck color="white" />
          </div>
          Published
        </button>
      </div>
      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
        <EditProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
