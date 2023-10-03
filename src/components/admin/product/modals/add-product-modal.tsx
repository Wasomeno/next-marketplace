"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Id, toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { addProduct } from "@/app/actions/products"

import { CategoryPicker } from "../category-picker"

export const ProductSchema = z.object({
  name: z.string().min(5).max(25),
  price: z.number().min(100).max(1000000000),
  description: z.string().min(20).max(200),
  stock: z.number().min(10).max(10000000),
  slug: z.string().min(5).max(25),
})

export type ProductFormData = z.infer<typeof ProductSchema>

export function AddProductModal() {
  const [files, setFiles] = useState<Array<FileImage>>([])
  const [selectedCategory, setSelectedCategory] = useState(0)
  const { register, handleSubmit, formState, getValues, clearErrors, reset } =
    useForm<ProductFormData>({
      resolver: zodResolver(ProductSchema),
    })

  const { startUpload } = useUploadThing("imageUploader")

  const toastRef = useRef<Id>(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  const mutation = useMutation(
    async () => {
      const uploadedFiles = await startUpload(files)
      return await addProduct({
        product: { ...getValues(), category_id: selectedCategory },
        image_urls: uploadedFiles?.map((file) => ({ image_url: file.url })) as {
          image_url: string
        }[],
      })
    },
    {
      onMutate: () => {
        router.push("/admin/products")
        toastRef.current = toast.loading(`Adding ${getValues("name")}`)
      },
      onSuccess: () => {
        reset()
        setSelectedCategory(0)
        setFiles([])
        toast.update(toastRef.current, {
          type: "success",
          render: `Successfully add new product`,
          isLoading: false,
          autoClose: 1500,
        })
      },
    }
  )

  const open = searchParams.get("add") !== null

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        router.replace("/admin/products")
        clearErrors()
      }}
    >
      <DialogContent open={open} className="bg-slate-50 lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Add Product" />
        <form
          onSubmit={handleSubmit(() => {
            mutation.mutate()
          })}
          className="flex w-full flex-col gap-4 px-6 py-4"
        >
          <div className="flex flex-col gap-1">
            <label id="productName" className="text-sm">
              Image
            </label>
            <ImageUploader
              files={files}
              setFiles={setFiles}
              deselectFile={(fileIndex) =>
                setFiles(files.filter((file, index) => fileIndex !== index))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="productName" className="text-sm">
              Name
            </label>
            <Input
              id="productName"
              type="text"
              {...register("name")}
              className="dark:border-neutral-600 dark:bg-neutral-800"
            />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="productPrice" className="text-sm">
              Price
            </label>
            <Input
              id="productPrice"
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="dark:border-neutral-600 dark:bg-neutral-800"
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
              className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
              {...register("description")}
            />
            {formState.errors.description?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="productStock" className="text-sm">
              Stock
            </label>
            <Input
              id="productStock"
              type="number"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              {...register("stock", { valueAsNumber: true })}
            />
            {formState.errors.stock?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.stock.message}
              </p>
            )}
            <div className="flex flex-col gap-1">
              <label id="productSlug" className="text-sm">
                Slug
              </label>
              <Input
                id="productSlug"
                type="text"
                className="dark:border-neutral-600 dark:bg-neutral-800"
                {...register("slug")}
              />
              {formState.errors.slug?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label id="productCategory" className="text-sm">
              Category
            </label>
            <CategoryPicker
              selectedCategory={selectedCategory}
              selectCategory={(categoryId) => setSelectedCategory(categoryId)}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
