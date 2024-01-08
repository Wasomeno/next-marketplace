"use client"

import { error, table } from "console"
import { url } from "inspector"
import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { BiChevronRight } from "react-icons/bi"
import { IoShirt } from "react-icons/io5"
import { Id, toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { MultiSelectDropdown, Option } from "@/components/multi-select-dropdown"
import { addProduct } from "@/app/actions/products"

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
    .max(200, "Description can't be more than 200 characters"),
  stock: z
    .number()
    .min(10, "Stock must have at least 10")
    .max(10000, "Stock must have at least 10.000"),
})

export type ProductFormData = z.infer<typeof ProductSchema>

export function AddProductForm({
  categories,
}: {
  categories: Pick<Category, "id" | "name">[]
}) {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([])
  const [files, setFiles] = useState<Array<FileImage>>([])
  const [isLoading, startTransition] = useTransition()
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const { startUpload } = useUploadThing("imageUploader")

  const toastRef = useRef<Id>(0)
  const router = useRouter()

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  function generateSlug() {
    return getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  function onSubmit(inputs: ProductFormData) {
    startTransition(async () => {
      toastRef.current = toast.loading(`Adding ${inputs.name}`)
      try {
        const uploadedFiles = await startUpload(files)
        await addProduct({
          ...inputs,
          slug: generateSlug(),
          images: uploadedFiles?.map((file) => ({
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
        reset()
        setFiles([])
      } catch (error) {}
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 lg:w-4/6"
    >
      <ImageUploader
        files={files}
        setFiles={setFiles}
        deselectFile={(fileIndex) => {
          setFiles((selectedFiles) =>
            selectedFiles.filter((_, index) => fileIndex !== index)
          )
        }}
      />
      <Fieldset
        label="Name"
        className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
        <Input
          placeholder="Input your product name"
          className="w-full"
          {...register("name")}
        />
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
          placeholder="Input your product price"
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
          placeholder="Input your product stock"
          className="w-full"
          {...register("stock", { valueAsNumber: true })}
        />
      </Fieldset>
      <Fieldset
        label="Description"
        className="col-span-2 flex flex-col gap-2 rounded-lg border border-gray-100 p-3"
      >
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
