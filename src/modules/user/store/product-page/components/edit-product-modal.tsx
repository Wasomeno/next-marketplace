"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { getProduct } from "@/actions/product"
import { updateProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"

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
import { Skeleton } from "@/components/skeleton"

import { ProductFormData, ProductSchema } from "./create-product-modal"

export const EditProductModal: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const searchParamsValues = useSearchParamsValues<{
    edit: string
    id: string
  }>()

  const isOpen = searchParamsValues.edit !== undefined

  const product = useQuery({
    queryKey: ["product", searchParamsValues.id],
    queryFn: () => getProduct(Number(searchParamsValues.id)),
    enabled: isOpen,
  })

  const categories = useQuery({
    queryKey: categoryQueryKeys.all(),
    queryFn: () => getCategories(),
    enabled: isOpen,
  })

  const {
    files,
    addFiles,
    removeFile,
    isLoading: isFileLoading,
  } = useImageFiles(product.isLoading ? [] : product.data?.images)

  const router = useRouter()

  const pathname = usePathname()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const { startUpload } = useUploadThing("imageUploader")

  const categoryOptions = categories.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const selectedCategories = form.watch("categoryIds", [])

  function closeModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.delete("edit")
    urlSearchParams.delete("id")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  const updateProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages || !uploadedImages.length) {
        throw new Error("Error When Uploading Product Imagess")
      }

      await updateProduct({
        ...formData,
        storeId,
        id: parseInt(searchParamsValues.id),
        categoryIds: formData.categoryIds,
        images: uploadedImages?.map((image) => ({
          name: image.name,
          url: image.url,
        })),
        status: "published",
        featured_image_url: uploadedImages[0]?.url,
      })
    },
    onSuccess: () => {
      const urlSearchParams = new URLSearchParams(searchParamsValues)
      urlSearchParams.delete("edit")
      urlSearchParams.delete("id")

      router.replace(`${pathname}?${urlSearchParams.toString()}`)
      toast.success("Successfully Updated Product")
    },
    onError: (error) => {
      toast.error(error.message ?? "Error updating product")
    },
  })

  useEffect(() => {
    if (product.data) {
      form.reset({
        ...product.data,
        categoryIds: product.data.categories.map((category) => category.id),
      })
    }
  }, [product.isLoading])

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent open={isOpen} className="h-[36rem] lg:w-[30rem]">
          <DialogHeader title="Edit Store Product" />
          <form
            onSubmit={form.handleSubmit((formData) =>
              updateProductMutation.mutate(formData)
            )}
            className="flex w-full flex-col gap-4 p-4"
          >
            {product.isLoading || isFileLoading ? (
              <div className="flex items-center gap-2">
                {Array(3).fill(<Skeleton className="h-28 w-28" />)}
              </div>
            ) : (
              <ImageUploader
                files={files}
                selectFiles={addFiles}
                deselectFile={removeFile}
                isMultiple
              />
            )}

            <Fieldset label="Name" className="flex flex-col gap-2 ">
              <Input className="w-full" {...form.register("name")} />
              {form.formState.errors.name && (
                <span className="text-xs text-red-600">
                  {form.formState.errors.name.message}
                </span>
              )}
            </Fieldset>
            <Fieldset label="Categories" className="flex flex-col gap-2 ">
              <Dropdown
                options={categoryOptions}
                selectedOptions={categoryOptions?.filter((option) =>
                  selectedCategories?.includes(option.value)
                )}
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
                variant="defaultOutline"
                size="sm"
                className="w-full lg:w-32"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                disabled={updateProductMutation.isPending}
                variant="default"
                size="sm"
                className="w-full lg:w-32"
              >
                {updateProductMutation.isPending && (
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
