"use client"

import React, { useEffect } from "react"
import { updateStore } from "@/actions/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"

type Props = {
  store: Store | null
}

const storeProfileSchema = z.object({
  name: z.string().min(5, "Name must have at least 10 characters"),
  location: z.string(),
  description: z
    .string()
    .min(10, "Description must have at least 10 characters"),
})

type StoreProfileFormData = z.infer<typeof storeProfileSchema>

export const StoreProfileForm: React.FC<Props> = ({ store }) => {
  const form = useForm<StoreProfileFormData>({
    resolver: zodResolver(storeProfileSchema),
  })

  const updateStoreMutation = useMutation({
    mutationFn: async (formData: StoreProfileFormData) =>
      await updateStore({
        ...formData,
        id: store?.id as number,
        slug: formData.name.toLowerCase().replace(" ", "-"),
      }),
    onSuccess: () => toast.success("Store profile updated"),
    onError: () => toast.success("Error updating store profile"),
  })

  useEffect(() => {
    form.reset({
      ...store,
    })
  }, [])

  return (
    <form
      onSubmit={form.handleSubmit((formData) =>
        updateStoreMutation.mutate(formData)
      )}
      className="w-full px-4 lg:w-2/6 lg:px-0"
    >
      <div className="mb-4 space-y-4 lg:h-60">
        <div className="grid grid-cols-4 gap-2 text-sm">
          <span className="col-span-4 font-medium text-gray-400 lg:col-span-1">
            Name
          </span>
          <div className="col-span-4 space-y-2 lg:col-span-3">
            <Input
              placeholder="Input your store name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <span className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <span className="col-span-4 font-medium text-gray-400 lg:col-span-1">
            Location
          </span>
          <div className="col-span-4 space-y-2 lg:col-span-3">
            <Input
              placeholder="Input your store location"
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <span className="text-xs text-red-500">
                {form.formState.errors.location.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <span className="col-span-4 font-medium text-gray-400 lg:col-span-1">
            Description
          </span>
          <div className="col-span-4 space-y-2 lg:col-span-3">
            <TextArea
              placeholder="Input your store description"
              {...form.register("description")}
              className="h-28"
            />
            {form.formState.errors.description && (
              <span className="text-xs text-red-500">
                {form.formState.errors.description.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="defaultOutline"
          className="w-20 lg:text-xs"
          disabled={!form.formState.isDirty || updateStoreMutation.isPending}
        >
          {updateStoreMutation.isPending && (
            <ImSpinner8 className="animate-spin" />
          )}
          Save
        </Button>
      </div>
    </form>
  )
}
