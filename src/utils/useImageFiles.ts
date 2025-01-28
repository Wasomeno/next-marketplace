"use client"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"

import { FileImage } from "@/components/image-uploader"

const singleImageQuery = (image: { name: string; url: string } | undefined) =>
  queryOptions<FileImage | undefined>({
    queryKey: ["fetchedImage", image?.url],
    queryFn: async () => {
      return await fetch((image as { name: string; url: string }).url)
        .then((image) => image.blob())
        .then((blobImage) => {
          const imageFile = new File([blobImage], image?.name as string, {
            type: blobImage.type,
          })
          return Object.assign(imageFile, {
            preview: URL.createObjectURL(imageFile),
          })
        })
    },
    enabled: image !== undefined,
  })

const mutlipleImageQuery = (
  images: { name: string; url: string }[] | undefined
) =>
  queryOptions<FileImage[] | undefined>({
    queryKey: ["images", images?.map((image) => image.url).join("-")],
    queryFn: async () => {
      return await Promise.all(
        (images as { name: string; url: string }[]).map((image) =>
          fetch(image.url)
            .then((image) => image.blob())
            .then((blobImage) => {
              const imageFile = new File([blobImage], image.name, {
                type: blobImage.type,
              })
              return Object.assign(imageFile, {
                preview: URL.createObjectURL(imageFile),
              })
            })
        )
      )
    },
    enabled: images !== undefined,
  })

export function useFetchMultipleImages(
  images: { url: string; name: string }[]
) {
  return useQuery(mutlipleImageQuery(images))
}

export function useFetchSingleImage(
  image: { url: string; name: string } | undefined
) {
  return useQuery(singleImageQuery(image))
}
