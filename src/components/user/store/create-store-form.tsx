"use client"

import React, { useState } from "react"
import Link from "next/link"
import Lottie from "lottie-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FaSpinner } from "react-icons/fa"
import { HiArrowRight } from "react-icons/hi2"
import { z } from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import checkMarkSuccess from "@/components/lottie/files/checkmark_success.json"
import { createStore } from "@/app/actions/store"

const createStoreSchema = z.object({
  name: z.string().min(10, "10 characters minimum"),
  description: z.string().min(20, "20 characters minimum"),
  location: z.string().min(10, "10 Characters Minimum"),
  image: z.string(),
})

type CreateStoreFormData = z.infer<typeof createStoreSchema>

export function CreateStoreForm() {
  const [step, setStep] = useState<"name" | "details" | "loading" | "success">(
    "name"
  )

  const session = useSession()

  const linkStyle = buttonVariants({
    className: "w-full gap-2",
    variant: "default",
    size: "default",
  })

  const { handleSubmit, register, formState, watch } =
    useForm<CreateStoreFormData>()

  async function onSubmit(store: CreateStoreFormData) {
    setStep("loading")
    try {
      await createStore({
        ...store,
        profile_image: store.image ?? "",
        created_at: new Date(),
        owner_email: session.data?.user.email as string,
      })
      setStep("success")
    } catch (error) {}
  }

  return (
    <form className="w-96 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {step === "name" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Give your store a name</h2>
          <Input placeholder="Name for your store" {...register("name")} />
        </div>
      )}
      {step === "details" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Your Store Details</h2>
          <Fieldset label="Profile Image">
            <div></div>
          </Fieldset>
          <Fieldset label="Location">
            <Input
              placeholder="Your store location"
              {...register("location")}
            />
          </Fieldset>
          <Fieldset label="Description">
            <TextArea
              placeholder="Your store description"
              className="h-40"
              {...register("description")}
            />
          </Fieldset>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin" />
          <span>Creating your store</span>
        </div>
      )}

      {step === "success" && (
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
        <Button onClick={() => setStep("details")} className={linkStyle}>
          <span>Continue</span> <HiArrowRight />
        </Button>
      ) : null}

      {step === "details" && (
        <Button
          disabled={!formState.isValid}
          variant="default"
          size="default"
          className="w-full"
        >
          Create Store
        </Button>
      )}

      {step === "success" && (
        <Link href="/store/home" className={linkStyle}>
          <span>Checkout your new store</span> <HiArrowRight />
        </Link>
      )}
    </form>
  )
}
