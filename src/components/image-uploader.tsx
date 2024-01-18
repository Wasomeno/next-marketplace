"use client"

import React from "react"
import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { LuImagePlus } from "react-icons/lu"
import { RxCross1 } from "react-icons/rx"
import FileResizer from "react-image-file-resizer"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

export type FileImage = File & { preview: string }

interface ImageUploaderProps {
  files: Array<File & { preview: string }>
  selectFiles: (files: FileImage[]) => void
  deselectFile: (index: number) => void
}

export const ImageUploader = ({
  files,
  selectFiles,
  deselectFile,
}: ImageUploaderProps) => {
  const { getInputProps, getRootProps } = useDropzone({
    onDrop: (selectedFiles) => {
      for (const selectedFile of selectedFiles) {
        FileResizer.imageFileResizer(
          selectedFile,
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
            const imageFile = new File([imageBlob], selectedFile.name)
            selectFiles([
              Object.assign(imageFile, {
                preview: URL.createObjectURL(imageFile),
              }),
            ])
          },
          "base64",
          500,
          500
        )
      }
    },
  })

  return (
    <div className="flex w-full flex-col gap-2">
      {files.length < 1 && (
        <div
          {...getRootProps({
            className:
              "flex items-center flex-col gap-2 cursor-pointer rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 h-32 justify-center border-dashed border border-gray-300",
          })}
        >
          <Input {...getInputProps()} />
          <LuImagePlus className="text-black text-opacity-50" size={20} />
          <p className="text-sm opacity-50">Drop your images here</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex h-28 w-28 items-center justify-center rounded-md border bg-white  p-2"
              >
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => deselectFile && deselectFile(index)}
                  className="absolute -right-2 -top-2 z-10 h-5 w-5 rounded-full p-1.5 text-white"
                >
                  <RxCross1 size="30" />
                </Button>
                <Image src={file.preview} alt="image-preview" fill />
              </div>
            ))}
            <div
              {...getRootProps({
                className:
                  "flex h-28 w-28 flex-col gap-2 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50",
              })}
            >
              <Input {...getInputProps()} />
              <LuImagePlus className="text-gray-500" size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
