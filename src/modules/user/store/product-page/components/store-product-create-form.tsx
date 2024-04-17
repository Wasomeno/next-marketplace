"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { addProduct } from "@/actions/store/products"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Id, toast } from "react-toastify"
import invariant from "tiny-invariant"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { Dropdown } from "@/components/dropdown"
import { ImageUploader } from "@/components/image-uploader"
import { Option } from "@/components/multi-select-dropdown"

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

export function StoreProductCreateForm() {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([])
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

  const router = useRouter()
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 lg:w-4/6"
    >
      <ImageUploader
        files={files}
        selectFiles={addFiles}
        deselectFile={(fileIndex) => {
          removeFile(fileIndex)
        }}
        isMultiple
      />
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
              categories.filter((category) => category.value !== option.value)
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
      <Fieldset label="Description" className="col-span-2 flex flex-col gap-2 ">
        <TextArea
          className="h-36 w-full"
          placeholder="Input your product description"
          {...register("description")}
        />
      </Fieldset>
      <div className="flex items-center justify-center gap-6">
        <Button
          disabled={!isValid || isLoading}
          variant="success"
          className="w-40 text-slate-50"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
