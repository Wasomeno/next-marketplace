"use client"

import { useEffect, useState } from "react"

import { FileImage } from "@/components/image-uploader"

export function useImageFiles(images?: { name: string; url: string }[]) {
  const [files, setFiles] = useState<Array<FileImage>>([])
  const [isLoading, setIsLoading] = useState(false)

  function addFiles(files: Array<FileImage>) {
    setFiles((current) => [...current, ...files])
  }

  function removeFile(fileIndex: number) {
    setFiles((current) => current.filter((_, index) => index !== fileIndex))
  }

  function clearFiles() {
    setFiles([])
  }

  useEffect(() => {
    if (images) {
      setIsLoading(true)
      Promise.all(
        images.map((image) =>
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
      ).then((result) => {
        setFiles(result)
        setIsLoading(false)
      })
    }
  }, [images?.length])

  return { files, addFiles, clearFiles, removeFile, isLoading }
}
