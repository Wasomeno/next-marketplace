"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { getCategoryDetails, updateCategory } from "@/app/actions/categories"

import { CategorySchema } from "./add-category-modal"

export function EditCategoryModal() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = parseInt(searchParams.get("id") ?? "0")
  const isEditModalOpen = searchParams.get("edit") !== null

  const categoryDetails = useQuery(
    ["categoryDetails", categoryId],
    async () => await getCategoryDetails(categoryId)
  )
  const { register, getValues, handleSubmit, formState } = useForm<
    z.infer<typeof CategorySchema>
  >({
    resolver: zodResolver(CategorySchema),
    values: {
      name: categoryDetails.data?.name as string,
      description: categoryDetails.data?.description as string,
      slug: categoryDetails.data?.slug as string,
    },
  })

  const updateMutation = useMutation(
    () =>
      toast.promise(
        updateCategory(
          categoryId,
          getValues("name"),
          getValues("description"),
          getValues("slug")
        ),
        {
          error: "Error",
          success: "Update Success",
          pending: "Updating " + getValues("name"),
        }
      ),
    {
      onMutate: () => router.push("/admin/categories"),
      onSuccess: () => categoryDetails.refetch(),
    }
  )

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={() => router.push("/admin/categories")}
    >
      <DialogContent open={isEditModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Edit Category" />
        <form
          onSubmit={handleSubmit(() => {
            updateMutation.mutate()
          })}
          className="flex w-full flex-col gap-4 px-6 py-4"
        >
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-gray-400">Id</label>
            <h5 className="text-lg">{categoryId}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium ">Name</label>
            <Input
              type="text"
              {...register("name")}
              className="dark:border-neutral-600 dark:bg-neutral-800"
            />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium ">Description</label>
            <TextArea
              {...register("description")}
              className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
            />
            {formState.errors.description?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium ">Slug</label>
            <Input
              type="text"
              {...register("slug")}
              className="dark:border-neutral-600 dark:bg-neutral-800"
            />
            {formState.errors.slug?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.slug.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium ">Products</label>
            <h5 className="text-lg">
              {categoryDetails?.data?.products?.length}
            </h5>
          </div>
          <div className="items-ceneter flex justify-center gap-4">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
