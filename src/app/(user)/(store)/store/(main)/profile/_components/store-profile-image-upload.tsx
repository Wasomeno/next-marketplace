"use client"

import { useUploadThing } from "@/utils/uploadthing"
import { useMutation, useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import Image from "next/image"
import React, { ChangeEvent, useState } from "react"
import { ImSpinner8 } from "react-icons/im"
import FileResizer from "react-image-file-resizer"
import { toast } from "sonner"

import { Skeleton } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import {
  getStoreProfileImage,
  updateStoreProfileImage,
} from "../../../_actions"

export const StoreProfileImageUpload: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const [image, setImage] = useState<(File & { preview: string }) | null>()

  const { startUpload } = useUploadThing("imageUploader")

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["storeProfileImage"],
    queryFn: () => getStoreProfileImage(storeId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const saveImageMutation = useMutation({
    mutationFn: async () => {
      const uploadedImages = await startUpload([image] as File[])
      if (!uploadedImages) {
        toast.error("Error when updating store profile image")
      } else {
        await updateStoreProfileImage({
          storeId,
          url: uploadedImages[0].url,
          name: uploadedImages[0].name,
        })
      }
      refetch()
      setImage(null)
    },
    onSuccess: () => toast.success("Successfully updated store profile image"),
    onError: () => toast.success("Error when updating store profile image"),
  })

  function selectImage(props: ChangeEvent<HTMLInputElement>) {
    const file = (props.target.files as FileList)[0] as File
    FileResizer.imageFileResizer(
      file,
      500,
      500,
      "WEBP",
      100,
      0,
      (uri) => {
        var byteString = atob((uri as string).split(",")[1])
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }

        const imageBlob = new Blob([ab], { type: "image/webp" })
        const imageFile = new File([imageBlob], file.name)
        setImage(
          Object.assign(imageFile, {
            preview: URL.createObjectURL(imageFile),
          })
        )
      },
      "base64",
      500,
      500
    )
  }

  function resetImage() {
    setImage(null)
  }

  return (
    <div className="flex flex-col items-center gap-4 lg:items-start">
      <Skeleton
        className={clsx("h-52 w-52 border border-gray-200 lg:h-60 lg:w-60")}
      >
        {!isFetching && (
          <Image
            src={image ? image.preview : (data ?? "")}
            alt="store-profile-image"
            fill
          />
        )}
      </Skeleton>
      {!image && (
        <label
          id="imageUpload"
          className="w-full cursor-pointer rounded-lg border border-gray-200 py-2 text-center text-xs font-medium lg:text-sm"
        >
          Select photo
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={selectImage}
            className="hidden"
          />
        </label>
      )}

      {image && (
        <div className="flex w-full flex-1 items-center gap-2">
          <Button
            size="sm"
            variant="defaultOutline"
            className="flex-1 lg:text-xs"
            onClick={resetImage}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 lg:text-xs"
            onClick={() => saveImageMutation.mutate()}
            disabled={saveImageMutation.isPending}
          >
            {saveImageMutation.isPending && (
              <ImSpinner8 className="animate-spin" />
            )}
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
