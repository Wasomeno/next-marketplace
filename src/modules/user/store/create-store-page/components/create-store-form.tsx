"use client"

import React, { useState } from "react"
import Link from "next/link"
import { createStore } from "@/actions/store/store"
import { useUploadThing } from "@/utils/uploadthing"
import { useImageFiles } from "@/utils/useImageFiles"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Lottie from "lottie-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FaSpinner } from "react-icons/fa"
import { HiArrowRight } from "react-icons/hi2"
import { ImSpinner8 } from "react-icons/im"
import { z } from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { ImageUploader } from "@/components/image-uploader"
import checkMarkSuccess from "@/components/lottie/files/checkmark_success.json"

const createStoreSchema = z.object({
  name: z.string().min(5, "Store name must have at least 5 characters"),
  description: z
    .string()
    .min(5, "Store description must have at least 5 characters"),
  location: z.string().min(5, "Store location must have at least 5 characters"),
})

type CreateStoreFormData = z.infer<typeof createStoreSchema>

type CreateStoreSteps = "name" | "details"

export function CreateStoreForm() {
  const [step, setStep] = useState<CreateStoreSteps>("name")

  const { files, addFiles, removeFile } = useImageFiles()

  const session = useSession()

  const uploadthing = useUploadThing("imageUploader")

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
  })

  const linkStyle = buttonVariants({
    className: "w-full",
    variant: "defaultOutline",
    size: "default",
  })
  const storeName = form.watch("name")

  const createStoreMutation = useMutation({
    mutationFn: async (formData: CreateStoreFormData) => {
      const images = await uploadthing.startUpload(files)
      if (!images) {
        throw new Error("Error when uploading image")
      }
      await createStore({
        ...formData,
        slug: formData.name.split(" ").join("-").toLowerCase(),
        profile_image: images[0].url,
        created_at: new Date(),
        owner_email: session.data?.user.email as string,
      })
    },
  })

  function setStoreName() {
    if (storeName.length < 5) {
      form.trigger("name", { shouldFocus: true })
      return
    }

    form.clearErrors("name")
    setStep("details")
  }

  return (
    <form
      className="w-full space-y-4 p-8 lg:w-96 lg:p-0"
      onSubmit={form.handleSubmit((formData) =>
        createStoreMutation.mutate(formData)
      )}
    >
      {step === "name" && !createStoreMutation.isPending && (
        <div className="flex flex-col gap-2 lg:gap-4">
          <h1 className="text-lg font-medium lg:text-2xl">
            Give your store a name
          </h1>
          <div className="space-y-2">
            <Input placeholder="Input store name" {...form.register("name")} />
            {form.formState.errors.name && (
              <span className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
        </div>
      )}
      {step === "details" && !createStoreMutation.isPending && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Your Store Details</h2>
          <Fieldset label="Profile Image">
            <ImageUploader
              files={files}
              selectFiles={addFiles}
              deselectFile={removeFile}
              isMultiple={false}
            />
          </Fieldset>
          <Fieldset label="Location">
            <Input
              placeholder="Your store location"
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <span className="text-xs text-red-500">
                {form.formState.errors.location.message}
              </span>
            )}
          </Fieldset>
          <Fieldset label="Description">
            <TextArea
              placeholder="Your store description"
              className="h-40"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <span className="text-xs text-red-500">
                {form.formState.errors.description.message}
              </span>
            )}
          </Fieldset>
        </div>
      )}

      {createStoreMutation.isPending && (
        <div className="flex flex-col items-center gap-4">
          <ImSpinner8 className="animate-spin" />
          <span>Creating your store</span>
        </div>
      )}

      {createStoreMutation.isSuccess && !createStoreMutation.isPending && (
        <div className="flex flex-col items-center gap-4">
          <Lottie
            animationData={checkMarkSuccess}
            loop={false}
            className="h-24 w-24"
          />
          <span>Successfully Created Store !</span>
        </div>
      )}

      {step === "name" ? (
        <Button
          type="button"
          onClick={setStoreName}
          className="w-full shadow-sm"
        >
          <span>Continue</span> <HiArrowRight />
        </Button>
      ) : null}

      {step === "details" && !createStoreMutation.isPending && (
        <Button variant="default" size="default" className="w-full">
          Create Store
        </Button>
      )}

      {createStoreMutation.isSuccess && !createStoreMutation.isPending && (
        <Link href="/store/home" className={linkStyle}>
          <span>Checkout your new store</span> <HiArrowRight />
        </Link>
      )}
    </form>
  )
}
