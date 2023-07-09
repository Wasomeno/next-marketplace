import "@uploadthing/react/styles.css";

import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Id, toast } from "react-toastify";
import * as z from "zod";

import { FileImage, ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { queryClient } from "@/lib/react-query-client";
import { uploadFiles, useUploadThing } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import CategoryScrollableList from "./category-scrollable-list";

interface AddProductModalProps {
  isAddModalOpen: boolean;
  setOpenModal: (open: boolean) => void;
}

const AddProductFormSchema = z.object({
  name: z.string().min(5).max(25),
  price: z.number().min(100).max(1000000000),
  description: z.string().min(20).max(200),
  stock: z.number().min(10).max(10000000),
  slug: z.string().min(5).max(25),
});

type AddProductFormData = z.infer<typeof AddProductFormSchema>;

export const AddProductModal = ({
  isAddModalOpen,
  setOpenModal,
}: AddProductModalProps) => {
  const [files, setFiles] = useState<Array<FileImage>>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    clearErrors,
    reset,
  } = useForm<AddProductFormData>({
    resolver: zodResolver(AddProductFormSchema),
  });
  const toastRef = useRef<Id>(0);
  const { startUpload } = useUploadThing("imageUploader");
  const mutation = useMutation(
    async () => {
      const uploadedFiles = await startUpload(files);
      return await axios.post("/api/products", {
        ...getValues(),
        category_id: selectedCategory,
        image_urls: uploadedFiles?.map((file) => ({ image_url: file.fileUrl })),
      });
    },
    {
      onMutate: () => {
        setOpenModal(false);
        toastRef.current = toast.loading(`Adding ${getValues("name")}`);
      },
      onSuccess: (response) => {
        reset();
        setSelectedCategory(0);
        setFiles([]);
        toast.update(toastRef.current, {
          type: "success",
          render: response.data.message,
          isLoading: false,
          autoClose: 1500,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(["products"]);
      },
    }
  );

  return (
    <Dialog
      open={isAddModalOpen}
      onOpenChange={(open) => {
        setOpenModal(open);
        clearErrors();
      }}
    >
      <DialogContent
        open={isAddModalOpen}
        className="bg-slate-100 lg:h-5/6 lg:w-3/6"
      >
        <DialogHeader title="Add Product" />
        <form
          onSubmit={handleSubmit(() => {
            mutation.mutate();
          })}
          className="flex w-full flex-col gap-4 px-6 py-4"
        >
          <div className="flex flex-col gap-1">
            <label id="productName" className="text-sm">
              Image
            </label>
            <ImageUploader
              files={files}
              setFiles={setFiles}
              deselectFile={(fileIndex) =>
                setFiles(files.filter((file, index) => fileIndex !== index))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label id="productName" className="text-sm">
              Name
            </label>
            <Input id="productName" type="text" {...register("name")} />
            {formState.errors.name?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="productPrice" className="text-sm">
              Price
            </label>
            <Input
              id="productPrice"
              type="number"
              {...register("price", { valueAsNumber: true })}
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
              className="h-40"
              {...register("description")}
            />
            {formState.errors.description?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label id="productStock" className="text-sm">
              Stock
            </label>
            <Input
              id="productStock"
              type="number"
              className="rounded-md p-2"
              {...register("stock", { valueAsNumber: true })}
            />
            {formState.errors.stock?.message && (
              <p className="text-sm text-red-600">
                {formState.errors.stock.message}
              </p>
            )}
            <div className="flex flex-col gap-1">
              <label id="productSlug" className="text-sm">
                Slug
              </label>
              <Input
                id="productSlug"
                type="text"
                className="rounded-md  p-2"
                {...register("slug")}
              />
              {formState.errors.slug?.message && (
                <p className="text-sm text-red-600">
                  {formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label id="productCategory" className="text-sm">
              Category
            </label>
            <CategoryScrollableList
              selectedCategory={selectedCategory}
              selectCategory={(categoryId) => setSelectedCategory(categoryId)}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
