"use client";

import { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/react-query-client";
import { Category, Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

async function updateCategory(name: string, id: number) {
  await fetch("/api/categories/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });
}

const CategoryEditModal = ({
  categoryDetails,
  setOpenEditModal,
  isEditModalOpen,
}: {
  categoryDetails: Category & { products: Product[] };
  setOpenEditModal: (open: boolean) => void;
  isEditModalOpen: boolean;
}) => {
  const [categoryName, setCategoryName] = useState("");
  const updateMutation = useMutation(
    () =>
      toast.promise(updateCategory(categoryName, categoryDetails.id), {
        error: "Error",
        success: "Update Success",
        pending: "Updating " + categoryDetails.name,
      }),
    {
      onMutate: () => setOpenEditModal(false),
      onSuccess: () => queryClient.invalidateQueries(["categories"]),
    }
  );

  useLayoutEffect(() => {
    setCategoryName(categoryDetails.name);
  }, [categoryDetails.name]);

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={(open) => setOpenEditModal(open)}
    >
      <DialogContent open={isEditModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Edit Category" />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate();
          }}
          className="flex w-full flex-col gap-4 px-6 py-4"
        >
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-gray-400">Id</label>
            <h5 className="text-lg">{categoryDetails.id}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <Input
              type="text"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value);
              }}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <label className="text-sm font-medium text-slate-800">
              Products
            </label>
            <h5 className="text-lg">{categoryDetails.products?.length}</h5>
          </div>
          <div className="items-ceneter flex justify-center gap-4">
            <Button variant="success" className="w-40 text-slate-50">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;
