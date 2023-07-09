"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Category, Product } from "@prisma/client";

const CategoryDetailsModal = ({
  categoryDetails,
  isDetailsModalOpen,
  setOpenDetailsModal,
}: {
  categoryDetails: Category & { products: Product[] };
  isDetailsModalOpen: boolean;
  setOpenDetailsModal: (open: boolean) => void;
}) => {
  return (
    <Dialog
      open={isDetailsModalOpen}
      onOpenChange={(open) => setOpenDetailsModal(open)}
    >
      <DialogContent open={isDetailsModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Category Details" />
        <div className="flex w-full flex-col gap-4 px-6">
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Id</h6>
            <h5 className="text-lg">{categoryDetails.id}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Name</h6>
            <h5 className="text-lg">{categoryDetails.name}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Products</h6>
            <h5 className="text-lg">{categoryDetails.products?.length}</h5>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailsModal;
