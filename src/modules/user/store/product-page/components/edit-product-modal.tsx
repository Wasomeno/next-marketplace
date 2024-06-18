"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { getProduct } from "@/actions/product"
import { updateProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { useFetchMultipleImages } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { ImageUploader } from "@/components/image-uploader"
import { MultiSelectDropdown } from "@/components/multi-select-dropdown"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from "@/components/responsive-dialog"
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
    queryKey: categoryQueryKeys.all().baseKey,
    queryFn: () => getCategories(),
    enabled: isOpen,
  })

  const router = useRouter()

  const pathname = usePathname()

  const images = useFetchMultipleImages(product.data?.images ?? [])

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const { startUpload } = useUploadThing("imageUploader")

  const categoryOptions =
    categories.data?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []

  function closeModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.delete("edit")
    urlSearchParams.delete("id")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  const updateProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const uploadedImages = await startUpload(formData.images)

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

      queryClient.invalidateQueries({
        queryKey: storeQueryKeys.products({ storeId }).baseKey,
      })

      queryClient.invalidateQueries({
        queryKey: ["product", searchParamsValues.id],
      })

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
        images: images?.data,
        categoryIds: product.data.categories.map((category) => category.id),
      })
    }
  }, [product.isLoading])

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={(open) => !open && closeModal()}
    >
      <ResponsiveDialogContent
        open={isOpen}
        className="h-auto max-h-[36rem] lg:w-[30rem]"
      >
        <ResponsiveDialogHeader
          title="Edit Store Product"
          description="Make changes to existing store product"
        />
        <form
          onSubmit={form.handleSubmit((formData) =>
            updateProductMutation.mutate(formData)
          )}
          className="flex w-full flex-col gap-4 overflow-y-scroll px-4 py-4 lg:px-6"
        >
          <Fieldset label="Images" className="flex flex-col gap-2 ">
            {images.isLoading ? (
              Array(3).fill(<Skeleton className="h-20 w-20 lg:h-28 lg:w-28" />)
            ) : (
              <ImageUploader
                mode="multiple"
                images={images.data}
                onImagesChange={(images) => form.setValue("images", images)}
              />
            )}
          </Fieldset>
          <Fieldset
            label="Name"
            className="flex flex-col gap-2 "
            error={form.formState.errors.name}
          >
            <Input className="w-full" {...form.register("name")} />
          </Fieldset>
          <Fieldset
            label="Categories"
            className="flex flex-col gap-2 "
            error={form.formState.errors.categoryIds}
          >
            <MultiSelectDropdown
              options={categoryOptions}
              onOptionsChange={(options) => {
                form.setValue(
                  "categoryIds",
                  options.map((option) => Number(option.value))
                )
              }}
            />
          </Fieldset>
          <Fieldset
            label="Price"
            className="flex flex-col gap-2 "
            error={form.formState.errors.price}
          >
            <Input
              type="number"
              className="w-full"
              {...form.register("price", { valueAsNumber: true })}
            />
          </Fieldset>
          <Fieldset
            label="Stock"
            className="flex flex-col gap-2 "
            error={form.formState.errors.stock}
          >
            <Input
              type="number"
              className="w-full"
              {...form.register("stock", { valueAsNumber: true })}
            />
          </Fieldset>
          <Fieldset
            label="Description"
            className="col-span-2 flex flex-col gap-2 "
            error={form.formState.errors.description}
          >
            <TextArea
              className="h-36 w-full"
              {...form.register("description")}
            />
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
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
