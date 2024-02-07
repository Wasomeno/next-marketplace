"use client"

import React, { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { useUploadThing } from "@/utils/uploadthing"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { FaSpinner } from "react-icons/fa"
import FileResizer from "react-image-file-resizer"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"
import {
  getStoreProfileImage,
  updateStoreProfileImage,
} from "@/app/actions/store/store"

export const StoreProfileImageUpload = () => {
  const [image, setImage] = useState<(File & { preview: string }) | null>()

  const { startUpload } = useUploadThing("imageUploader")

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["storeProfileImage"],
    queryFn: () => getStoreProfileImage(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  async function saveImage() {
    toast.promise(
      async () => {
        const uploadedImages = await startUpload([image] as File[])
        if (!uploadedImages) {
          toast.error("Error when updating store profile image")
        } else {
          await updateStoreProfileImage(
            uploadedImages[0].url,
            uploadedImages[0].name
          )
        }
        refetch()
        setImage(null)
      },

      {
        pending: "Updating Store Profile Image",
        error: "Error when updating store profile image",
        success: "Succesfully updated store profile image",
      }
    )
  }

  return (
    <div className="flex w-52 flex-col items-center gap-2 lg:w-64 lg:items-start">
      <Skeleton
        className={clsx("h-52 w-52 border border-gray-200 lg:h-64 lg:w-64")}
      >
        {!isFetching && (
          <Image
            src={image ? image.preview : data ?? ""}
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
        <div className="flex w-full flex-1 items-center gap-2 text-white">
          <Button onClick={resetImage} variant="danger" className="flex-1">
            Cancel
          </Button>
          <Button onClick={saveImage} variant="success" className="flex-1">
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
