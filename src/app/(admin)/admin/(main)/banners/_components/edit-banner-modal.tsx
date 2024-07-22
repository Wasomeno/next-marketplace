"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import { ClientUploadedFileData } from "uploadthing/types"

import { getBanner, updateBanner } from "@/actions/admin/banner"
import { ImageUploader } from "@/components/image-uploader"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { queryClient } from "@/lib/react-query-client"
import { bannersQuery } from "@/query/queryOptions/bannerQueryOptions"
import { useUploadThing } from "@/utils/uploadthing"
import { useFetchSingleImage } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  CreateBannerFormData,
  createBannerFormDataSchema,
} from "./create-banner-modal"

export function EditBannerModal() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const bannerId = searchParams.get("id") !== null

  const banner = useQuery({
    queryKey: ["banner", bannerId],
    queryFn: () => getBanner({ id: Number(bannerId) }),
  })

  const images = useFetchSingleImage({
    name: banner.data?.name as string,
    url: banner.data?.url as string,
  })

  const uploadthing = useUploadThing("imageUploader")

  const form = useForm<CreateBannerFormData>({
    resolver: zodResolver(createBannerFormDataSchema),
  })

  const isOpen = searchParams.get("edit") !== null

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

  const updateBannerMutation = useMutation({
    mutationFn: async (formData: CreateBannerFormData) => {
      let imageResults: ClientUploadedFileData<null>[] | undefined = []
      if (formData.image.name !== banner.data?.name) {
        imageResults = await uploadthing.startUpload([formData.image])
        if (!imageResults?.length) {
          throw new Error("Error when uploading image")
        }
      }
      await updateBanner({
        id: Number(bannerId),
        name: formData.name,
        url: imageResults[0]?.url ?? banner.data?.url,
      })
    },
    onSuccess: () => {
      onOpenChange(false)
      queryClient.invalidateQueries(bannersQuery())
      toast.success("Succesfully updated banner")
    },
    onError: ({ message }) =>
      toast.error(message ?? "Error when updating banner"),
  })

  useEffect(() => {
    if (!banner.isLoading && banner.data) {
      form.reset({
        name: banner.data.name,
      })
    }
  }, [banner.isLoading])

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent open={isOpen} className="lg:h-4/6 lg:w-3/6">
        <ResponsiveDialogHeader title="Edit Banner" />
        <form
          onSubmit={form.handleSubmit((formData) =>
            updateBannerMutation.mutate(formData)
          )}
          className="flex flex-1 flex-col gap-4 px-6 py-4"
        >
          <div className="flex flex-1 flex-col gap-4">
            <Fieldset label="Image">
              <ImageUploader
                mode="single"
                image={images.data}
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
            </Fieldset>
            <Fieldset label="Name" error={form.formState.errors.name}>
              <Input
                id="bannerName"
                type="text"
                placeholder="Input banner name"
                className="dark:border-neutral-600 dark:bg-neutral-800"
                {...form.register("name")}
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
              disabled={updateBannerMutation.isPending}
            >
              {updateBannerMutation.isPending && (
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
