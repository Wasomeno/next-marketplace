"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUploadThing } from "@/utils/uploadthing"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"

const AddCategoryModal = () => {
  const [categoryImages, setCategoryImages] = useState<FileImage[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const uploadthing = useUploadThing("imageUploader")

  const isAddModalOpen = searchParams.get("add") !== null

  const mutation = useMutation(
    async () =>
      toast.promise(addCategory(), {
        pending: "Adding " + categoryName,
        success: "Succesfully added " + categoryName,
        error: "Error",
      }),
    {
      onMutate: () => router.push("/admin/categories"),
      onSettled: () => queryClient.invalidateQueries(["categories"]),
    }
  )

  async function addCategory() {
    const imageFiles = await uploadthing.startUpload(categoryImages)
    const result = await axios.post("/api/categories", {
      name: categoryName,
      slug: categorySlug,
      description: categoryDescription,
      image_urls: imageFiles?.map((image) => ({ image_url: image.fileUrl })),
    })
    return result
  }

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
          onSubmit={async (event) => {
            event.preventDefault()
            mutation.mutate()
          }}
          className="flex flex-col gap-4 px-6 py-4"
        >
          <div className="flex flex-col gap-1">
            <label id="name" className="text-sm">
              Image
            </label>
            <ImageUploader
              files={categoryImages}
              setFiles={setCategoryImages}
              deselectFile={(index) =>
                setCategoryImages(
                  categoryImages.filter(
                    (image, imageIndex) => index !== imageIndex
                  )
                )
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="name" className="text-sm">
              Name
            </label>
            <Input
              id="name"
              type="text"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="name" className="text-sm">
              Description
            </label>
            <TextArea
              id="categoryDescription"
              className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
              value={categoryDescription}
              onChange={(event) => setCategoryDescription(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="slug" className="text-sm">
              Slug
            </label>
            <Input
              id="slug"
              type="text"
              className="dark:border-neutral-600 dark:bg-neutral-800"
              value={categorySlug}
              onChange={(event) => setCategorySlug(event.target.value)}
            />
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

export default AddCategoryModal