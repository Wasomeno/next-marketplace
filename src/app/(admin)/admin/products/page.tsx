"use client";

import dynamic from "next/dynamic";
import { useReducer } from "react";
import { BsPlus } from "react-icons/bs";

import {
  adminDashboardReducer,
  adminDashboardState,
} from "@/components/admin/admin-dashboard-reducer";
import { Button } from "@/components/ui/button";

import { ProductsTable } from "./components/products-table";
import { ProductsTableRowMenu } from "./components/products-table/products-table-row-menu";

const ProductDetailsModal = dynamic(
  async () =>
    (await import("./components/product-details-modal")).ProductDetailsModal
);

const ProductEditModal = dynamic(
  async () => (await import("./components/product-edit-modal")).ProductEditModal
);

const AddProductModal = dynamic(
  async () =>
    (await import("@/app/(admin)/admin/products/components/add-product-modal"))
      .AddProductModal
);

const ShopProducts = () => {
  const [state, dispatch] = useReducer(
    adminDashboardReducer,
    adminDashboardState
  );

  return (
    <div className="flex w-full flex-1 flex-col bg-gray-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Products
        </h1>
        <div className="my-2 flex justify-between gap-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                dispatch({ type: "set_open_add_modal", open: true })
              }
              className="flex w-32 items-center justify-evenly border bg-white hover:border-blue-200 hover:bg-blue-100"
            >
              <BsPlus size="20" /> Product
            </Button>
          </div>
        </div>
      </div>
      <ProductsTable
        tableRowMenu={(selectedRow) => (
          <ProductsTableRowMenu
            setProductDetails={() =>
              dispatch({ type: "set_data_details", dataDetails: selectedRow })
            }
            openDetailsModal={() =>
              dispatch({ type: "set_open_details_modal", open: true })
            }
            openEditModal={() =>
              dispatch({ type: "set_open_edit_modal", open: true })
            }
          />
        )}
      />

      <AddProductModal
        isAddModalOpen={state.isAddModalOpen}
        setOpenModal={(open) =>
          dispatch({ type: "set_open_add_modal", open: open })
        }
      />
      <ProductDetailsModal
        productDetails={state.dataDetails}
        isDetailsModalOpen={state.isDetailsModalOpen}
        setOpenDetailsModal={(open) =>
          dispatch({ type: "set_open_details_modal", open: open })
        }
      />
      {state.isEditModalOpen && (
        <ProductEditModal
          productDetails={state.dataDetails}
          isEditModalOpen={state.isEditModalOpen}
          setOpenEditModal={(open) =>
            dispatch({ type: "set_open_edit_modal", open: open })
          }
        />
      )}
    </div>
  );
};

export default ShopProducts;
