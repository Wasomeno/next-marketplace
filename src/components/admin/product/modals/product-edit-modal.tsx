"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { getProductDetails } from "@/app/actions/products"

import CategoryScrollableList from "../category-scrollable-list"

const EditProductFormSchema = z.object({
  name: z.string().min(5).max(25),
  price: z.number().min(100).max(1000000000),
  description: z.string().min(20).max(100),
  stock: z.number().min(10).max(10000000),
  slug: z.string().min(5).max(25),
  category_id: z.number().min(1),
})

type EditProductFormData = z.infer<typeof EditProductFormSchema>

export const ProductEditModal = () => {
  const [files, setFiles] = useState<Array<FileImage>>([])

  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = parseInt(searchParams.get("id") as string)

  const isEditModalOpen = searchParams.get("edit") !== null

  const productDetails = useQuery(
    ["productDetails", productId],
    async () => await getProductDetails(productId),
    { enabled: isEditModalOpen }
  )

  const {
    register,
    getValues,
    setValue,
    formState,
    handleSubmit,
    clearErrors,
  } = useForm<EditProductFormData>({
    resolver: zodResolver(EditProductFormSchema),
    values: {
      name: productDetails.data?.name as string,
      price: productDetails.data?.price as number,
      description: productDetails.data?.description as string,
      stock: productDetails.data?.stock as number,
      slug: productDetails.data?.slug as string,
      category_id: productDetails.data?.category_id as number,
    },
  })

  const updateMutation = useMutation(
    () =>
      toast.promise(updateProduct(), {
        error: "Error",
        success: "Update Success",
        pending: "Updating " + productDetails.data?.name,
      }),
    {
      onMutate: () => router.push("/admin/products"),
      onSuccess: () => queryClient.invalidateQueries(["products"]),
    }
  )

  async function updateProduct() {
    await fetch("/api/products/" + productId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getValues()),
    })
  }

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={() => {
        router.push("/admin/products")
        clearErrors()
      }}
    >
      <DialogContent
        open={isEditModalOpen}
        className="bg-slate-100 lg:h-5/6 lg:w-3/6"
      >
        <DialogHeader title="Edit Product" />
        <form
          onSubmit={handleSubmit(() => {
            updateMutation.mutate()
          })}
          className="flex flex-col gap-2.5 px-6 py-2"
        >
          <div className="flex flex-col items-start gap-1 text-gray-400">
            <label className="text-sm font-medium ">Id</label>
            <h5 className="text-lg">{productId}</h5>
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Image</label>
            <ImageUploader files={files} setFiles={setFiles} />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <Input {...register("name")} />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Price</label>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
            {formState.errors.price?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.price.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="productDescription" className="text-sm">
              Description
            </label>
            <TextArea
              id="productDescription"
              className="h-40"
              {...register("description")}
            />
            {formState.errors.description?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Stock</label>
            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
            />
            {formState.errors.stock?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.stock.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">
              Category
            </label>
            <CategoryScrollableList
              selectedCategory={getValues("category_id")}
              selectCategory={(category_id) =>
                setValue("category_id", category_id)
              }
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
