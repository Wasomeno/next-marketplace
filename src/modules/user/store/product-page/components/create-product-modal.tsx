"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { addProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { Dropdown } from "@/components/dropdown"
import { ImageUploader } from "@/components/image-uploader"

export const ProductSchema = z.object({
  name: z
    .string()
    .min(5, "Name must have at least 5 characters")
    .max(25, "Name can't be longer than 25 characters"),
  price: z
    .number()
    .min(100, "Price must have at least 3 digits")
    .max(1000000000, "Price can't be more than a billion rupiah"),
  description: z
    .string()
    .min(20, "Description must have at least 20 characters")
    .max(750, "Description can't be more than 200 characters"),
  stock: z
    .number()
    .min(10, "Stock must have at least 10")
    .max(10000, "Stock must have at least 10.000"),
  categoryIds: z
    .array(z.number())
    .min(1, "Product must have a category")
    .default([]),
})

export type ProductFormData = z.infer<typeof ProductSchema>

export const CreateProductModal = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsValues = useSearchParamsValues<{ create: string }>()
  const isOpen = searchParamsValues.create !== undefined

  const { files, addFiles, removeFile } = useImageFiles()

  const categories = useQuery({
    queryKey: categoryQueryKeys.all(),
    queryFn: () => getCategories(),
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const { startUpload } = useUploadThing("imageUploader")

  const categoryOptions = categories.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const selectedCategories = form.watch("categoryIds", [])

  const createProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const uploadedFiles = await startUpload(files)
      if (!uploadedFiles || !uploadedFiles.length) {
        throw new Error("Error When Uploading Product Imagess")
      }
      addProduct({
        ...formData,
        images: uploadedFiles.map((file) => ({
          name: file.name,
          url: file.url,
        })) as { name: string; url: string }[],
        categoryIds: formData.categoryIds,
        featured_image_url: uploadedFiles[0].url as string,
        status: "published",
      })
    },
    onSuccess: () => {
      const urlSearchParams = new URLSearchParams(searchParamsValues)
      urlSearchParams.delete("create")
      router.replace(`${pathname}?${urlSearchParams.toString()}`)
      toast.success("Succesfully created new product")
    },
    onError: (error) =>
      toast.error(error.message ?? "Error when creating new product"),
  })

  return (
    <Dialog open={isOpen} onOpenChange={() => router.replace(pathname)}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent open={isOpen} className="h-[36rem] lg:w-[30rem]">
          <DialogHeader title="Create Store Product" />
          <form
            onSubmit={form.handleSubmit((formData) =>
              createProductMutation.mutate(formData)
            )}
            className="flex w-full flex-col gap-4 p-4"
          >
            <Fieldset label="Images" className="flex flex-col gap-2 ">
              <ImageUploader
                files={files}
                selectFiles={addFiles}
                deselectFile={(fileIndex) => {
                  removeFile(fileIndex)
                }}
                isMultiple
              />
            </Fieldset>
            <Fieldset label="Name" className="flex flex-col gap-2 ">
              <Input
                placeholder="Input your product name"
                className="w-full"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.name.message}
                </span>
              )}
            </Fieldset>
            <Fieldset label="Categories" className="flex flex-col gap-2 ">
              <Dropdown
                options={categoryOptions}
                isLoading={categories.isLoading}
                selectedOptions={categoryOptions?.filter((option) =>
                  selectedCategories?.includes(option.value)
                )}
                className="w-72"
                onOptionClick={(option) =>
                  form.setValue("categoryIds", [
                    ...selectedCategories,
                    Number(option.value),
                  ])
                }
                deselectOption={(option) =>
                  form.setValue(
                    "categoryIds",
                    selectedCategories.filter(
                      (categoryId) => option.value !== categoryId
                    )
                  )
                }
                isMulti
              />
              {form.formState.errors.categoryIds && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.categoryIds.message}
                </span>
              )}
            </Fieldset>
            <Fieldset label="Price" className="flex flex-col gap-2 ">
              <Input
                type="number"
                placeholder="Input your product price"
                className="w-full"
                {...form.register("price", { valueAsNumber: true })}
              />
              {form.formState.errors.price && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.price.message}
                </span>
              )}
            </Fieldset>
            <Fieldset label="Stock" className="flex flex-col gap-2 ">
              <Input
                type="number"
                placeholder="Input your product stock"
                className="w-full"
                {...form.register("stock", { valueAsNumber: true })}
              />
              {form.formState.errors.stock && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.stock.message}
                </span>
              )}
            </Fieldset>
            <Fieldset
              label="Description"
              className="col-span-2 flex flex-col gap-2 "
            >
              <TextArea
                className="h-36 w-full"
                placeholder="Input your product description"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.description.message}
                </span>
              )}
            </Fieldset>
            <div className="flex flex-wrap-reverse items-center justify-end gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="w-full text-white lg:w-32"
                onClick={() => router.replace(pathname)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full lg:w-32"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending && (
                  <ImSpinner8 className="animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
