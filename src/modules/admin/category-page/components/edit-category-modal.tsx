"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getCategory, updateCategory } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useUploadThing } from "@/utils/uploadthing"
import { useFetchSingleImage } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import { ClientUploadedFileData } from "uploadthing/types"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { ImageUploader } from "@/components/image-uploader"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from "@/components/responsive-dialog"
import { Skeleton } from "@/components/skeleton"

import {
  CreateCategoryFormData,
  createCategoryFormDataSchema,
} from "./add-category-modal"

export function EditCategoryModal() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const uploadthing = useUploadThing("imageUploader")

  const categoryId = parseInt(searchParams.get("id") ?? "0")
  const isOpen = searchParams.get("edit") !== null

  const category = useQuery({
    queryKey: categoryQueryKeys.single(categoryId),
    queryFn: async () => await getCategory(categoryId),
  })

  const image = useFetchSingleImage({
    name: category.data?.image?.name as string,
    url: category.data?.image?.url as string,
  })

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormDataSchema),
  })

  function generateSlug() {
    return form.getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)
    if (isOpen) {
      urlSearchParams.set("edit", "true")
    } else {
      urlSearchParams.delete("edit")
      urlSearchParams.delete("id")
    }

    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  const editCategoryMutation = useMutation({
    mutationFn: async (formData: CreateCategoryFormData) => {
      let imageResults: ClientUploadedFileData<null>[] | undefined = []

      if (image.data?.name !== category.data?.image?.name)
        imageResults = await uploadthing.startUpload([formData.image])
      if (!imageResults?.length) {
        throw new Error("Error when uploading image")
      }

      await updateCategory({
        ...formData,
        id: categoryId,
        slug: generateSlug(),
        image: imageResults[0],
      })
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all().baseKey,
      })
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.single(categoryId),
      })
      onOpenChange(false)
      toast.success("Succesfully updated category")
    },
    onError() {
      toast.error("Error when updating category")
    },
  })

  useEffect(() => {
    if (category.data !== undefined && image.data !== undefined) {
      form.reset({ ...category.data, image: image.data })
    }
  }, [category.isLoading, image.isLoading])

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        open={isOpen}
        className="flex flex-1 flex-col lg:h-5/6 lg:w-2/6"
      >
        <ResponsiveDialogHeader title="Edit Category" />
        <form
          onSubmit={form.handleSubmit((formData) =>
            editCategoryMutation.mutate(formData)
          )}
          className="flex flex-1 flex-col justify-between px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            <Fieldset label="Image">
              {category.isLoading || image.isLoading ? (
                <div className="flex items-center justify-center ">
                  <Skeleton className="h-36 w-36 lg:h-48 lg:w-48" />
                </div>
              ) : (
                <ImageUploader
                  mode="single"
                  image={image.data}
                  onImageChange={(image) => {
                    if (image) {
                      form.setValue("image", image, {
                        shouldValidate: true,
                      })
                    } else {
                      form.resetField("image")
                    }
                  }}
                />
              )}
            </Fieldset>

            <Fieldset label="Name" error={form.formState.errors.name}>
              <Input
                id="categoryName"
                type="text"
                placeholder="Input category name here"
                className="dark:border-neutral-600 dark:bg-neutral-800"
                {...form.register("name")}
              />
            </Fieldset>

            <Fieldset
              label="Description"
              error={form.formState.errors.description}
            >
              <TextArea
                id="categoryDescription"
                placeholder="Input category description here"
                className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
                {...form.register("description")}
              />
            </Fieldset>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="defaultOutline"
              size="sm"
              className="w-32 lg:text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-32 lg:text-xs"
              disabled={editCategoryMutation.isPending}
            >
              {editCategoryMutation.isPending && (
                <ImSpinner8 className="animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
