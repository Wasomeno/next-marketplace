"use client"

import React, { useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { addProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Id, toast } from "react-toastify"
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
import { Dropdown, Option } from "@/components/dropdown"
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
})

export type ProductFormData = z.infer<typeof ProductSchema>

export const CreateProductModal = () => {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsValues = useSearchParamsValues<{ create: string }>()
  const isOpen = searchParamsValues.create !== undefined

  const { files, addFiles, removeFile } = useImageFiles()
  const [isLoading, startTransition] = useTransition()

  const categories = useQuery({
    queryKey: categoryQueryKeys.all(),
    queryFn: () => getCategories(),
  })

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const { startUpload } = useUploadThing("imageUploader")

  const toastRef = useRef<Id>(0)

  const categoryOptions = categories.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  function onSubmit(inputs: ProductFormData) {
    startTransition(async () => {
      toastRef.current = toast.loading(`Adding ${inputs.name}`)
      try {
        const uploadedFiles = await startUpload(files)

        if (!uploadedFiles) {
          throw new Error("Error WHen Uploading Product Imagess")
        }

        await addProduct({
          ...inputs,
          images: uploadedFiles.map((file) => ({
            name: file.name,
            url: file.url,
          })) as { name: string; url: string }[],
          categoryIds: selectedCategories.map((category) =>
            Number(category.value)
          ),
          featured_image_url: uploadedFiles[0].url as string,
          status: "published",
        })
        toast.update(toastRef.current, {
          type: "success",
          render: `Successfully add new product`,
          isLoading: false,
          autoClose: 1500,
        })
        router.push("/store/products")
      } catch (error) {
        toast.update(toastRef.current, {
          type: "error",
          render: (error as Error).message,
          isLoading: false,
          autoClose: 1500,
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => router.replace(pathname)}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent open={isOpen} className="h-[36rem] lg:w-[30rem]">
          <DialogHeader title="Create Store Product" />
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                {...register("name")}
              />
            </Fieldset>
            <Fieldset label="Categories" className="flex flex-col gap-2 ">
              <Dropdown
                options={categoryOptions}
                isLoading={categories.isLoading}
                selectedOptions={selectedCategories}
                className="w-72"
                onOptionClick={(option) =>
                  setSelectedCategories((categories) => [...categories, option])
                }
                deselectOption={(option) =>
                  setSelectedCategories((categories) =>
                    categories.filter(
                      (category) => category.value !== option.value
                    )
                  )
                }
                isMulti
              />
            </Fieldset>
            <Fieldset label="Price" className="flex flex-col gap-2 ">
              <Input
                type="number"
                placeholder="Input your product price"
                className="w-full"
                {...register("price", { valueAsNumber: true })}
              />
            </Fieldset>
            <Fieldset label="Stock" className="flex flex-col gap-2 ">
              <Input
                type="number"
                placeholder="Input your product stock"
                className="w-full"
                {...register("stock", { valueAsNumber: true })}
              />
            </Fieldset>
            <Fieldset
              label="Description"
              className="col-span-2 flex flex-col gap-2 "
            >
              <TextArea
                className="h-36 w-full"
                placeholder="Input your product description"
                {...register("description")}
              />
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
                disabled={!isValid || isLoading}
                variant="default"
                size="sm"
                className="w-full lg:w-32"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
