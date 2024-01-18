"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { FaSpinner } from "react-icons/fa"
import { toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { updateCategory } from "@/app/actions/admin/categories"
import { getCategory } from "@/app/actions/categories"

import { CategoryFormData, CategorySchema } from "./add-category-modal"

export function EditCategoryModal() {
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = parseInt(searchParams.get("id") ?? "0")
  const open = searchParams.get("edit") !== null

  const categoryDetails = useQuery({
    queryKey: ["categoryDetails", categoryId],
    queryFn: async () => await getCategory(categoryId),
  })

  const { register, getValues, handleSubmit, formState } = useForm<
    z.infer<typeof CategorySchema>
  >({
    resolver: zodResolver(CategorySchema),
    values: {
      name: categoryDetails.data?.name as string,
      description: categoryDetails.data?.description as string,
    },
  })

  function onSubmit(inputs: CategoryFormData) {
    startTransition(async () => {
      await toast.promise(
        updateCategory({
          ...inputs,
          id: categoryId,
          slug: generateSlug(),
          images: [],
        }),
        {
          error: "Error",
          success: "Update Success",
          pending: "Updating " + getValues("name"),
        }
      )

      router.push("/admin/categories")
    })
  }

  function generateSlug() {
    return getValues("name")?.toLowerCase().replaceAll(" ", "-")
  }

  return (
    <Dialog open={open} onOpenChange={() => router.push("/admin/categories")}>
      <DialogContent
        open={open}
        className="flex flex-1 flex-col bg-slate-50 lg:h-5/6 lg:w-3/6"
      >
        <DialogHeader title="Edit Category" />
        {categoryDetails.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <FaSpinner className="animate-spin fill-blue-500" size={30} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between px-6 py-4"
          >
            <div className="flex flex-col gap-4">
              <Fieldset label="Name" error={formState.errors.name}>
                <Input
                  id="categoryName"
                  type="text"
                  placeholder="Input category name here"
                  className="dark:border-neutral-600 dark:bg-neutral-800"
                  {...register("name")}
                />
              </Fieldset>

              <Fieldset
                label="Description"
                error={formState.errors.description}
              >
                <TextArea
                  id="categoryDescription"
                  placeholder="Input category description here"
                  className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
                  {...register("description")}
                />
              </Fieldset>
            </div>

            <div className="flex items-center justify-center gap-6">
              <Button
                disabled={!formState.isValid || isLoading}
                variant="success"
                className="w-40 text-slate-50"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
