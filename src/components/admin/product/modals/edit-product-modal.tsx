"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { FaSpinner } from "react-icons/fa"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { FileImage, ImageUploader } from "@/components/image-uploader"
import { getProduct, updateProduct } from "@/app/actions/products"

import { CategoryPicker } from "../category-picker"
import { ProductFormData, ProductSchema } from "./add-product-modal"

export function EditProductModal() {
  const searchParams = useSearchParams()
  const open = searchParams.get("edit") !== null

  const productId = parseInt(searchParams.get("id") as string)

  const productDetails = useQuery(
    ["productDetails", productId],
    async () => await getProduct(productId),
    { enabled: open }
  )

  const [images, setImages] = useState<Array<FileImage>>([])
  const [selectedCategory, setSelectedCategory] = useState(
    productDetails.data?.category.id
  )

  const router = useRouter()

  const { register, getValues, formState, handleSubmit, clearErrors } =
    useForm<ProductFormData>({
      resolver: zodResolver(ProductSchema),
      values: {
        name: productDetails.data?.name as string,
        price: productDetails.data?.price as number,
        description: productDetails.data?.description as string,
        stock: productDetails.data?.stock as number,
        slug: productDetails.data?.slug as string,
      },
    })

  const updateMutation = useMutation(
    () =>
      toast.promise(
        updateProduct({
          ...getValues(),
          productId,
          categoryId: selectedCategory as number,
        }),
        {
          error: "Error",
          success: "Update Success",
          pending: "Updating " + productDetails.data?.name,
        }
      ),
    {
      onSuccess() {
        productDetails.refetch()
      },
    }
  )

  async function getImageFiles(imagePromises: Promise<File>[]) {
    const imageFiles = await Promise.all(imagePromises)
    setImages(
      imageFiles.map((image) =>
        Object.assign(image, {
          preview: URL.createObjectURL(image),
        })
      )
    )
  }

  useEffect(() => {
    if (!productDetails.isLoading) {
      const imageUrls = productDetails.data?.images.map((image) =>
        fetch(image.image_url)
          .then((response) => response.blob())
          .then((blob) => new File([blob], "image.jpeg", { type: blob.type }))
      )
      getImageFiles(imageUrls as Promise<File>[])
    }

    return () => {
      setImages([])
    }
  }, [productDetails.isLoading])

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        router.push("/admin/products")
        clearErrors()
      }}
    >
      <DialogContent
        open={open}
        className="flex flex-1 flex-col bg-slate-100 lg:h-5/6 lg:w-3/6"
      >
        <DialogHeader title="Edit Product" />
        {productDetails.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <FaSpinner className="animate-spin fill-blue-500" size={30} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(() => updateMutation.mutate())}
            className="flex flex-col gap-4 px-6 py-2"
          >
            <div className="flex flex-col items-start gap-1 text-gray-400">
              <label className="text-sm font-medium text-gray-400">Id</label>
              <h5 className="text-lg">{productId}</h5>
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-sm font-medium">Image</label>
              <ImageUploader files={images} setFiles={setImages} />
              {formState.errors.name?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-sm font-medium ">Name</label>
              <Input
                {...register("name")}
                className="dark:border-neutral-600 dark:bg-neutral-800"
              />
              {formState.errors.name?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="dark:border-neutral-600 dark:bg-neutral-800"
              />
              {formState.errors.price?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.price.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label id="productDescription" className="text-sm">
                Description
              </label>
              <TextArea
                id="productDescription"
                className="h-40 dark:border-neutral-600 dark:bg-neutral-800"
                {...register("description")}
              />
              {formState.errors.description?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="dark:border-neutral-600 dark:bg-neutral-800"
              />
              {formState.errors.stock?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.stock.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-sm font-medium">Category</label>
              <CategoryPicker
                selectedCategory={
                  selectedCategory ??
                  (productDetails.data?.category_id as number)
                }
                selectCategory={(category_id) =>
                  setSelectedCategory(category_id)
                }
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button variant="success" className="w-40 text-slate-50">
                Submit
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
