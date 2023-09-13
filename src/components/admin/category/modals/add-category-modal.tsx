"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { addCategory } from "@/app/actions/categories"

export const CategorySchema = z.object({
  name: z.string().min(5).max(100),
  slug: z.string().min(5).max(50),
  description: z.string().min(20).max(200),
})

export function AddCategoryModal() {
  const [images, setImages] = useState<FileImage[]>([])

  const uploadthing = useUploadThing("imageUploader")
  const { register, getValues, handleSubmit, formState } = useForm<
    z.infer<typeof CategorySchema>
  >({
    resolver: zodResolver(CategorySchema),
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const isAddModalOpen = searchParams.get("add") !== null

  const mutation = useMutation(
    async () =>
      toast.promise(
        async () => {
          const imageResults = await uploadthing.startUpload(images)
          addCategory({
            ...getValues(),
            imageUrls: imageResults?.map((result) => result.url) as string[],
          })
        },
        {
          pending: "Adding " + getValues("name"),
          success: "Succesfully added " + getValues("name"),
          error: "Error",
        }
      ),
    {
      onMutate: () => router.push("/admin/categories"),
      onSettled: () => queryClient.invalidateQueries(["categories"]),
    }
  )

  return (
    <Dialog
      open={isAddModalOpen}
      onOpenChange={() => router.push("/admin/categories")}
    >
      <DialogContent
        open={isAddModalOpen}
        className="bg-slate-100 lg:h-5/6 lg:w-3/6"
      >
        <DialogHeader title="Add Category" />
        <form
          onSubmit={handleSubmit(() => {
            mutation.mutate()
          })}
          className="flex flex-col gap-4 px-6 py-4"
        >
          <div className="flex flex-col gap-1">
            <label id="categoryImage" className="text-sm">
              Image
            </label>
            <ImageUploader
              files={images}
              setFiles={setImages}
              deselectFile={(index) =>
                setImages(
                  images.filter((image, imageIndex) => index !== imageIndex)
                )
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="categoryName" className="text-sm">
              Name
            </label>
            <Input
              id="categoryName"
              type="text"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              {...register("name")}
            />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="categoryDescription" className="text-sm">
              Description
            </label>
            <TextArea
              id="categoryDescription"
              className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
              {...register("description")}
            />
            {formState.errors.description?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.description?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="categorySlug" className="text-sm">
              Slug
            </label>
            <Input
              id="categorySlug"
              type="text"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              {...register("slug")}
            />
            {formState.errors.slug?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.slug?.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-6">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
