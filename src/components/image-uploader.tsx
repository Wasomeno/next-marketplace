"use client"

import React, { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { useDropzone } from "react-dropzone"
import { LuImagePlus } from "react-icons/lu"
import { RxCross1 } from "react-icons/rx"
import FileResizer from "react-image-file-resizer"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

export type FileImage = File & { preview: string }

type ImageUploaderProps = MultipleProps | SingleProps

type MultipleProps = {
  mode: "multiple"
  images?: Array<FileImage> | undefined
  onImagesChange?: (images: FileImage[]) => void
}

type SingleProps = {
  mode: "single"
  image?: FileImage | undefined
  onImageChange?: (image: FileImage | undefined) => void
}

export const ImageUploader = (props: ImageUploaderProps) => {
  const [imageFiles, setImageFiles] = useState(getImageStateDefaultValue())

  const { getInputProps, getRootProps } = useDropzone({
    multiple: props.mode === "multiple",
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    onDrop: (selectedFiles) => {
      const files = []
      for (const selectedFile of selectedFiles) {
        const imageFile = Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        })
        files.push(imageFile)
      }
      props.mode === "multiple" ? addFiles(files) : setFile(files[0])
    },
  })

  function getImageStateDefaultValue() {
    return props.mode === "multiple"
      ? !props.images
        ? []
        : props.images
      : !props.image
        ? undefined
        : props.image
  }

  function addFiles(files: Array<FileImage>) {
    if (Array.isArray(imageFiles)) {
      let newFiles = [...imageFiles, ...files]
      setImageFiles(newFiles)
      props.mode === "multiple" && props.onImagesChange !== undefined
        ? props.onImagesChange(newFiles)
        : null
    }
  }

  function removeFile(fileIndex: number) {
    if (Array.isArray(imageFiles)) {
      let newFiles = imageFiles.filter((_, index) => index !== fileIndex)
      setImageFiles(newFiles)
      props.mode === "multiple" && props.onImagesChange !== undefined
        ? props.onImagesChange(newFiles)
        : null
    }
  }

  function setFile(file: FileImage | undefined) {
    if (!Array.isArray(imageFiles)) {
      setImageFiles(file)
      props.mode === "single" && props.onImageChange
        ? props.onImageChange(file)
        : null
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {(Array.isArray(imageFiles) && !imageFiles.length) ||
      (!Array.isArray(imageFiles) && !imageFiles) ? (
        <div
          {...getRootProps({
            className:
              "flex items-center hover:bg-gray-100 transition-all duration-300 flex-col gap-2 cursor-pointer rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 h-32 justify-center border-dashed border border-gray-300",
          })}
        >
          <Input {...getInputProps()} />
          <LuImagePlus className="text-black text-opacity-50" size={20} />
          <p className="text-sm opacity-50">
            {props.mode === "multiple"
              ? "Drop your images here"
              : "Drop your image here"}
          </p>
        </div>
      ) : null}

      {props.mode === "multiple" &&
        Array.isArray(imageFiles) &&
        imageFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex h-20 w-20 items-center  justify-center bg-white p-2 lg:h-28 lg:w-28"
                >
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => removeFile(index)}
                    className={clsx(
                      "absolute -right-2 -top-2 z-10  h-5 w-5 rounded-full p-1.5 text-white"
                    )}
                  >
                    <RxCross1 size="30" />
                  </Button>
                  <Image
                    src={file.preview}
                    alt="image-preview"
                    fill
                    className="rounded-md border border-gray-200"
                  />
                </div>
              ))}

              <div
                {...getRootProps({
                  className:
                    "flex h-28 cursor-pointer w-28 flex-col gap-2 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50",
                })}
              >
                <Input {...getInputProps()} />
                <LuImagePlus className="text-gray-500" size={24} />
              </div>
            </div>
          </div>
        )}
      {props.mode === "single" && !Array.isArray(imageFiles) && imageFiles && (
        <div className="flex items-center justify-center">
          <div className="relative flex h-36 w-36  bg-white lg:h-48 lg:w-48">
            <Button
              variant="danger"
              type="button"
              onClick={() => setFile(undefined)}
              className={clsx(
                "absolute -right-2 -top-2 z-10 h-6  w-6 rounded-full p-2 text-white"
              )}
            >
              <RxCross1 size={30} />
            </Button>
            <Image
              src={imageFiles.preview}
              alt="image-preview"
              fill
              className="rounded-md border border-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  )
}
