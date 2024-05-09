"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createBanner } from "@/actions/admin/banner"
import { bannersQuery } from "@/modules/user/common/queryOptions/bannerQueryOptions"
import { useUploadThing } from "@/utils/uploadthing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
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
import { ImageUploader } from "@/components/image-uploader"

export const createBannerFormDataSchema = z.object({
  image: z.instanceof(File, { message: "Banner must have at least an image" }),
  name: z.string().min(5, "Name must have at least 5 characters").max(100),
})

export type CreateBannerFormData = z.infer<typeof createBannerFormDataSchema>

export function CreateBannerModal() {
  const uploadthing = useUploadThing("imageUploader")

  const { register, handleSubmit, formState, setValue, resetField } =
    useForm<CreateBannerFormData>({
      resolver: zodResolver(createBannerFormDataSchema),
    })

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("add") !== null

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

  const createBannerMutation = useMutation({
    mutationFn: async (formData: CreateBannerFormData) => {
      const imageResults = await uploadthing.startUpload([formData.image])
      if (!imageResults?.length) {
        throw new Error("Error when uploading image")
      }
      await createBanner({
        name: formData.name,
        url: imageResults[0].url,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(bannersQuery())
      onOpenChange(false)
      toast.success("Succesfully created new banner")
    },
    onError: ({ message }) =>
      toast.error(message ?? "Error when creating new banner"),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent open={isOpen} className="lg:h-4/6 lg:w-3/6">
              <DialogHeader title="Create Banner" />
              <form
                onSubmit={handleSubmit((formData) =>
                  createBannerMutation.mutate(formData)
                )}
                className="flex flex-1 flex-col gap-4 px-6 py-4"
              >
                <div className="flex flex-1 flex-col gap-4">
                  <Fieldset label="Image" error={formState.errors.image}>
                    <ImageUploader
                      mode="single"
                      onImageChange={(image) => {
                        if (image) {
                          setValue("image", image, { shouldValidate: true })
                        } else {
                          resetField("image")
                        }
                      }}
                    />
                  </Fieldset>
                  <Fieldset label="Name" error={formState.errors.name}>
                    <Input
                      id="bannerName"
                      type="text"
                      placeholder="Input banner name"
                      className="dark:border-neutral-600 dark:bg-neutral-800"
                      {...register("name")}
                    />
                  </Fieldset>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
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
                    disabled={createBannerMutation.isPending}
                  >
                    {createBannerMutation.isPending && (
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
