"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { addProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
import { storeProductsQuery } from "@/modules/user/common/queryOptions/storeQueryOptions"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import * as z from "zod"

import { queryClient } from "@/lib/react-query-client"
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
import { ImageUploader } from "@/components/image-uploader"
import { MultiSelectDropdown } from "@/components/multi-select-dropdown"

import { TBaseDataFilterParams } from "../../../../../../types"

export const ProductSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "Product must have at least 1 image")
    .default([]),
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

export const CreateProductModal: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsValues = useSearchParamsValues<
    TBaseDataFilterParams & {
      status: string
      create: string
      categories: string
    }
  >()
  const isOpen = searchParamsValues.create !== undefined

  const categories = useQuery({
    queryKey: categoryQueryKeys.all().baseKey,
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

  const createProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const uploadedFiles = await startUpload(formData.images)
      if (!uploadedFiles || !uploadedFiles.length) {
        throw new Error("Error When Uploading Product Imagess")
      }
      await addProduct({
        ...formData,
        storeId,
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
      queryClient.invalidateQueries({
        queryKey: storeQueryKeys.products().baseKey,
      })
      onOpenChange(false)
      toast.success("Succesfully created new product")
    },
    onError: (error) =>
      toast.error(error.message ?? "Error when creating new product"),
  })
  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    if (isOpen) {
      urlSearchParams.set("create", "true")
      router.replace(`${pathname}?${urlSearchParams.toString()}`, {
        scroll: false,
      })
    } else {
      form.reset()

      urlSearchParams.delete("create")

      router.replace(`${pathname}?${urlSearchParams.toString()}`, {
        scroll: false,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent open={isOpen} className="h-[36rem] lg:w-[30rem]">
              <DialogHeader title="Create Store Product" />
              <form
                onSubmit={form.handleSubmit((formData) =>
                  createProductMutation.mutate(formData)
                )}
                className="flex w-full flex-col gap-4 p-4 px-4 lg:px-6"
              >
                <Fieldset
                  label="Images"
                  className="flex flex-col gap-2 "
                  error={form.formState.errors.images}
                >
                  <ImageUploader
                    mode="multiple"
                    onImagesChange={(images) =>
                      form.setValue("images", images, { shouldValidate: true })
                    }
                  />
                </Fieldset>
                <Fieldset
                  label="Name"
                  className="flex flex-col gap-2 "
                  error={form.formState.errors.name}
                >
                  <Input
                    placeholder="Input your product name"
                    className="w-full"
                    {...form.register("name")}
                  />
                </Fieldset>
                <Fieldset
                  label="Categories"
                  className="flex flex-col gap-2 "
                  error={form.formState.errors.categoryIds}
                >
                  <MultiSelectDropdown
                    options={categoryOptions ?? []}
                    onSelect={() => {}}
                  />
                </Fieldset>
                <Fieldset
                  label="Price"
                  className="flex flex-col gap-2 "
                  error={form.formState.errors.price}
                >
                  <Input
                    type="number"
                    placeholder="Input your product price"
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
                    placeholder="Input your product stock"
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
                    placeholder="Input your product description"
                    {...form.register("description")}
                  />
                </Fieldset>
                <div className="flex flex-wrap-reverse items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="defaultOutline"
                    size="sm"
                    className="w-full lg:w-32 lg:text-xs"
                    onClick={() => router.replace(pathname)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full lg:w-32 lg:text-xs"
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
        )}
      </AnimatePresence>
    </Dialog>
  )
}
