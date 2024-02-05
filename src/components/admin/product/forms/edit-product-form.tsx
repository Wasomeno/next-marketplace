"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Prisma } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import invariant from "tiny-invariant"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { Dropdown } from "@/components/dropdown"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { MultiSelectDropdown, Option } from "@/components/multi-select-dropdown"
import { updateProduct } from "@/app/actions/store/products"

import { ProductFormData, ProductSchema } from "./add-product-form"

type Props = {
  product: Prisma.ProductGetPayload<{
    include: { images: true; categories: true }
  }>
  categories: Category[]
}

export function EditProductForm({ product, categories }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>(
    product.categories.map((category) => ({
      label: category.name,
      value: category.id,
    }))
  )

  const { files, addFiles, removeFile } = useImageFiles(product.images)

  const [isLoading, startTransition] = useTransition()

  const params = useParams<{ productId: string }>()
  const router = useRouter()

  const { getValues, register, reset, formState, handleSubmit } =
    useForm<ProductFormData>({
      resolver: zodResolver(ProductSchema),
    })

  const { startUpload } = useUploadThing("imageUploader")

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  function onSubmit(inputs: ProductFormData) {
    startTransition(async () => {
      try {
        await toast.promise(
          async () => {
            const uploadedImages = await startUpload(files)

            invariant(uploadedImages)

            return updateProduct({
              ...inputs,
              id: parseInt(params.productId),
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
          },
          {
            error: `Error when updating ${product.name}`,
            success: "Update Success",
            pending: `Updating ${product.name}`,
          }
        )
        router.push("/store/products")
      } catch (error) {}
    })
  }

  useEffect(() => {
    reset({
      ...product,
    })
  }, [product])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 lg:w-4/6"
    >
      <ImageUploader
        files={files}
        selectFiles={addFiles}
        deselectFile={removeFile}
        isMultiple
      />
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
              categories.filter((category) => category.value !== option.value)
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
      <Fieldset label="Description" className="col-span-2 flex flex-col gap-2 ">
        <TextArea className="h-36 w-full" {...register("description")} />
      </Fieldset>
      <div className="flex items-center justify-center gap-6">
        <Button
          disabled={!formState.isValid || isLoading}
          variant="success"
          className="w-40 text-slate-50"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
