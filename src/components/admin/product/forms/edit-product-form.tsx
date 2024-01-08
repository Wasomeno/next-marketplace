"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Prisma } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { MultiSelectDropdown, Option } from "@/components/multi-select-dropdown"
import { updateProduct } from "@/app/actions/products"

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

  const [images, setImages] = useState<Array<FileImage>>([])
  const [isLoading, startTransition] = useTransition()

  const params = useParams()

  const productId = parseInt(params.productId as string)
  const router = useRouter()

  const {
    getValues,
    register,
    reset,
    watch,
    setValue,
    formState,
    handleSubmit,
    clearErrors,
  } = useForm<ProductFormData>({
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
        const uploadedImages = await startUpload(images)
        await toast.promise(
          updateProduct({
            ...inputs,
            id: productId,
            slug: generateSlug(),
            categoryIds: selectedCategories.map(
              (category) => category.value as number
            ),
            images: uploadedImages?.map((image) => ({
              name: image.name,
              url: image.url,
            })) as { name: string; url: string }[],
            status: "published",
            featured_image_url: uploadedImages[0]?.url,
          }),
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

  function generateSlug() {
    return getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  useEffect(() => {
    reset({
      ...product,
    })
    Promise.all(
      product?.images.map((image) =>
        fetch(image.url)
          .then((image) => image.blob())
          .then((blobImage) => {
            const imageFile = new File([blobImage], image.name, {
              type: blobImage.type,
            })
            return Object.assign(imageFile, {
              preview: URL.createObjectURL(imageFile),
            })
          })
      )
    ).then((result) => setImages(result))
  }, [product])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 lg:w-4/6"
    >
      <ImageUploader
        files={images}
        setFiles={setImages}
        deselectFile={(fileIndex) => {
          setImages((selectedFiles) =>
            selectedFiles.filter((_, index) => fileIndex !== index)
          )
        }}
      />
      <Fieldset
        label="Name"
        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
        <Input className="w-full" {...register("name")} />
      </Fieldset>
      <Fieldset
        label="Categories"
        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
        <MultiSelectDropdown
          options={categoryOptions}
          selectedOptions={selectedCategories}
          onSelect={(option) =>
            setSelectedCategories((categories) => [...categories, option])
          }
        />
      </Fieldset>
      <Fieldset
        label="Price"
        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
        <Input
          type="number"
          className="w-full"
          {...register("price", { valueAsNumber: true })}
        />
      </Fieldset>
      <Fieldset
        label="Stock"
        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
        <Input
          type="number"
          className="w-full"
          {...register("stock", { valueAsNumber: true })}
        />
      </Fieldset>
      <Fieldset
        label="Description"
        className="col-span-2 flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
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
