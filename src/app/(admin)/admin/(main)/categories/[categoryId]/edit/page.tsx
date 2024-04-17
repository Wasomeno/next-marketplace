"use client"

import { useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCategory, updateCategory } from "@/actions/categories"
import {
  CategoryFormData,
  CategorySchema,
} from "@/modules/admin/category-page/components/add-category-modal"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { FaSpinner } from "react-icons/fa"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"

export default function EditCategoryPage() {
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const params = useParams()

  const categoryId = parseInt((params.categoryId as string) ?? "0")

  const categoryDetails = useQuery({
    queryKey: categoryQueryKeys.single(categoryId),
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
    <div className="flex w-full flex-1 flex-col p-5">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Edit Category
        </h1>
      </div>
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

            <Fieldset label="Description" error={formState.errors.description}>
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
    </div>
  )
}
