import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Product } from "@prisma/client";

interface ProductDetailsModalProps {
  isDetailsModalOpen: boolean;
  setOpenDetailsModal: (open: boolean) => void;
  productDetails: Product;
}

export const ProductDetailsModal = ({
  isDetailsModalOpen,
  setOpenDetailsModal,
  productDetails,
}: ProductDetailsModalProps) => {
  return (
    <Dialog
      open={isDetailsModalOpen}
      onOpenChange={(open) => setOpenDetailsModal(open)}
    >
      <DialogContent open={isDetailsModalOpen} className="lg:h-5/6 lg:w-3/6">
        <DialogHeader title="Product Details" />
        <div className="flex w-full flex-col gap-4 px-6">
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Id</h6>
            <h5 className="text-lg">{productDetails.id}</h5>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <h6 className="text-sm font-medium text-gray-400">Name</h6>
            <h5 className="text-lg">{productDetails.name}</h5>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
