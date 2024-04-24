"use client"

import React, { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { getProduct } from "@/actions/product"
import { updateProduct } from "@/actions/store/products"
import { useSearchParamsValues } from "@/utils"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import invariant from "tiny-invariant"

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
import { Skeleton } from "@/components/skeleton"

import { ProductFormData, ProductSchema } from "./create-product-modal"

export const EditProductModal = () => {
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
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    enabled: isOpen,
  })

  const [selectedCategories, setSelectedCategories] = useState<Option[]>([])

  const [isLoading, startTransition] = useTransition()

  const {
    files,
    addFiles,
    removeFile,
    isLoading: isFileLoading,
  } = useImageFiles(product.isLoading ? [] : product.data?.images)

  const router = useRouter()

  const pathname = usePathname()

  const { register, reset, formState, handleSubmit } = useForm<ProductFormData>(
    {
      resolver: zodResolver(ProductSchema),
    }
  )

  const { startUpload } = useUploadThing("imageUploader")

  const categoryOptions = categories.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  function closeModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.delete("edit")
    urlSearchParams.delete("id")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  async function onSubmit(inputs: ProductFormData) {
    startTransition(async () => {
      try {
        const uploadedImages = await startUpload(files)

        invariant(uploadedImages)

        await updateProduct({
          ...inputs,
          id: parseInt(searchParamsValues.id),
          categoryIds: selectedCategories.map(
            (category) => category.value as number
          ),
          images: uploadedImages?.map((image) => ({
            name: image.name,
            url: image.url,
          })) as { name: string; url: string }[],
          status: "published",
          featured_image_url: uploadedImages[0]?.url,
        })

        toast.success("Successfully Updated Product")
        router.push("/store/products")
      } catch (error) {
        toast.error(`Error when updating Product`)
      }
    })
  }

  useEffect(() => {
    if (product.data) {
      reset({
        ...product.data,
      })
      setSelectedCategories(
        product.data.categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      )
    }
  }, [product.isLoading])

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent open={isOpen} className="h-[36rem] lg:w-[30rem]">
          <DialogHeader title="Edit Store Product" />
          <form
            onSubmit={handleSubmit(onSubmit)}
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
              <Input className="w-full" {...register("name")} />
            </Fieldset>
            <Fieldset label="Categories" className="flex flex-col gap-2 ">
              <Dropdown
                options={categoryOptions}
                selectedOptions={selectedCategories}
                onOptionClick={(option) =>
                  setSelectedCategories((categories) => [...categories, option])
                }
                deselectOption={(option) => {
                  setSelectedCategories((categories) =>
                    categories.filter(
                      (category) => category.value !== option.value
                    )
                  )
                }}
                isMulti
              />
            </Fieldset>
            <Fieldset label="Price" className="flex flex-col gap-2 ">
              <Input
                type="number"
                className="w-full"
                {...register("price", { valueAsNumber: true })}
              />
            </Fieldset>
            <Fieldset label="Stock" className="flex flex-col gap-2 ">
              <Input
                type="number"
                className="w-full"
                {...register("stock", { valueAsNumber: true })}
              />
            </Fieldset>
            <Fieldset
              label="Description"
              className="col-span-2 flex flex-col gap-2 "
            >
              <TextArea className="h-36 w-full" {...register("description")} />
            </Fieldset>
            <div className="flex flex-wrap-reverse items-center justify-end gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="w-full text-white lg:w-32"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                disabled={!formState.isValid || isLoading}
                variant="default"
                size="sm"
                className="w-full lg:w-32"
              >
                {isLoading && <ImSpinner8 size={14} className="animate-spin" />}
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
