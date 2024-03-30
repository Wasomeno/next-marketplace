"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import {
  CategoryFormData,
  CategorySchema,
} from "@/components/admin/category/modals/add-category-modal"
import { ImageUploader } from "@/components/image-uploader"
import { addCategory } from "@/app/actions/admin/categories"

export default function AddCategoryPage() {
  const [isLoading, startTransition] = useTransition()
  const { files, addFiles, clearFiles, removeFile } = useImageFiles()

  const uploadthing = useUploadThing("imageUploader")

  const { register, getValues, handleSubmit, formState } =
    useForm<CategoryFormData>({
      resolver: zodResolver(CategorySchema),
    })

  const router = useRouter()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("add") !== null

  function generateSlug() {
    return getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  function onSubmit(inputs: CategoryFormData) {
    startTransition(async () => {
      try {
        await toast.promise(
          async () => {
            const imageResults = await uploadthing.startUpload(files)
            addCategory({
              ...inputs,
              images: imageResults?.map((result) => ({
                name: result.name,
                url: result.url,
              })) as { name: string; url: string }[],
              slug: generateSlug(),
            })
          },
          {
            pending: "Adding " + getValues("name"),
            success: "Succesfully added " + getValues("name"),
            error: "Error",
          }
        )
        router.push("/admin/categories")
      } catch (error) {}
    })
  }

  return (
    <div className="flex w-full flex-1 flex-col p-5">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Add Category
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col justify-between px-6 py-4"
      >
        <div className="flex flex-col gap-4">
          <Fieldset label="Image">
            <ImageUploader
              files={files}
              selectFiles={addFiles}
              deselectFile={(index) => removeFile(index)}
            />
          </Fieldset>
          <Fieldset label="Name" error={formState.errors.name}>
            <Input
              id="categoryName"
              type="text"
              placeholder="Input category name here"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              {...register("name")}
            />
          </Fieldset>

          <Fieldset label="Description" error={formState.errors.description}>
            <TextArea
              id="categoryDescription"
              placeholder="Input category description here"
              className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
              {...register("description")}
            />
          </Fieldset>
        </div>

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
    </div>
  )
}
