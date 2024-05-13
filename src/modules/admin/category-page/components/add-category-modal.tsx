"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addCategory } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import * as z from "zod"

import { queryClient } from "@/lib/react-query-client"
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
import { ImageUploader } from "@/components/image-uploader"

export const createCategoryFormDataSchema = z.object({
  image: z.instanceof(File, { message: "Category must have at least 1 image" }),
  name: z.string().min(5, "Name must have at least 5 characters").max(100),
  description: z
    .string()
    .min(20, "Description must have at least 20 characters")
    .max(200),
})

export type CreateCategoryFormData = z.infer<
  typeof createCategoryFormDataSchema
>

export function AddCategoryModal() {
  const uploadthing = useUploadThing("imageUploader")

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormDataSchema),
  })

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("add") !== null

  function generateSlug() {
    return form.getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)
    if (isOpen) {
      urlSearchParams.set("add", "true")
    } else {
      urlSearchParams.delete("add")
    }

    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  const createCategoryMutation = useMutation({
    mutationFn: async (formData: CreateCategoryFormData) => {
      const imageResults = await uploadthing.startUpload([formData.image])

      if (!imageResults?.length) {
        throw new Error("Error when uploading image")
      }

      await addCategory({
        ...formData,
        image: {
          name: imageResults[0].name,
          url: imageResults[0].url,
        },
        slug: generateSlug(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all().baseKey,
      })
      onOpenChange(false)
      toast.success("Succesfully created new category")
    },
    onError: () => toast.error("Error when creating new category"),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent open={isOpen} className="lg:h-5/6 lg:w-2/6">
              <DialogHeader title="Add Category" />
              <form
                onSubmit={form.handleSubmit((formData) =>
                  createCategoryMutation.mutate(formData)
                )}
                className="flex flex-1 flex-col gap-4 px-6 py-4"
              >
                <div className="flex flex-1 flex-col gap-4">
                  <Fieldset label="Image">
                    <ImageUploader
                      mode="single"
                      onImageChange={(image) => {
                        if (image !== undefined) {
                          form.setValue("image", image, {
                            shouldValidate: true,
                          })
                        } else {
                          form.resetField("image")
                        }
                      }}
                    />
                  </Fieldset>
                  <Fieldset label="Name" error={form.formState.errors.name}>
                    <Input
                      id="categoryName"
                      type="text"
                      placeholder="Input category name"
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
                      placeholder="Input category description"
                      className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
                      {...form.register("description")}
                    />
                  </Fieldset>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4">
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
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending && (
                      <ImSpinner8 className="animate-spin" />
                    )}
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
