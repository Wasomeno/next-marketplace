import { HiDotsVertical } from "react-icons/hi";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";

interface ProductsTableRowMenuProps {
  openEditModal: () => void;
  openDetailsModal: () => void;
  setProductDetails: () => void;
}

export const ProductsTableRowMenu = ({
  openDetailsModal,
  openEditModal,
  setProductDetails,
}: ProductsTableRowMenuProps) => {
  return (
    <Dropdown>
      <DropdownTrigger className="outline-none ring-0" asChild>
        <button className="mx-auto flex h-8 w-8 items-center justify-center">
          <HiDotsVertical className="h-[14px] w-[14px] fill-slate-600 lg:h-4 lg:w-4" />
        </button>
      </DropdownTrigger>
      <DropdownContent className="flex w-40 flex-col rounded-md border-x border-b bg-white text-xs shadow-sm">
        <DropdownItem asChild>
          <button
            className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-blue-100"
            onClick={() => {
              setProductDetails();
              openDetailsModal();
            }}
          >
            View Product
          </button>
        </DropdownItem>
        <DropdownItem asChild>
          <button
            className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-blue-100"
            onClick={() => {
              setProductDetails();
              openEditModal();
            }}
          >
            Edit Product
          </button>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};
