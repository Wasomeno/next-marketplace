"use client";

import dynamic from "next/dynamic";
import { useReducer } from "react";
import { BsPlus } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";

import AddCategoryModal from "@/app/(admin)/admin/categories/components/add-category-modal";
import {
  adminDashboardReducer,
  adminDashboardState,
} from "@/components/admin/admin-dashboard-reducer";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";

import CategoryDetailsModal from "./components/category-details-modal";
import { CategoryTable } from "./components/category-table/category-table";

const CategoryEditModal = dynamic(
  async () => await import("./components/category-edit-modal")
);

export default function ShopCategories() {
  const [state, dispatch] = useReducer(
    adminDashboardReducer,
    adminDashboardState
  );

  return (
    <div className="flex w-full flex-1 flex-col bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Categories
        </h1>
        <Button
          variant="success"
          size="sm"
          onClick={() => dispatch({ type: "set_open_add_modal", open: true })}
          className="hover:scale-[105%]"
        >
          <BsPlus size="16" className="text-slate-50" />
        </Button>
      </div>
      <CategoryTable
        tableRowMenu={(selectedRow) => (
          <Dropdown>
            <DropdownTrigger asChild>
              <button className="mx-auto flex h-8 w-8 items-center justify-center">
                <HiDotsVertical className="h-[14px] w-[14px] fill-slate-600 lg:h-4 lg:w-4" />
              </button>
            </DropdownTrigger>
            <DropdownContent className="flex w-40 flex-col rounded-md border-x border-b bg-white text-xs shadow-sm">
              <DropdownItem asChild>
                <button
                  onClick={() => {
                    dispatch({
                      type: "set_data_details",
                      dataDetails: selectedRow,
                    });
                    dispatch({ type: "set_open_details_modal", open: true });
                  }}
                  className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-blue-100"
                >
                  View Category
                </button>
              </DropdownItem>
              <DropdownItem asChild>
                <button
                  onClick={() => {
                    dispatch({
                      type: "set_data_details",
                      dataDetails: selectedRow,
                    });
                    dispatch({ type: "set_open_edit_modal", open: true });
                  }}
                  className="px-3 py-2 text-start outline-0 ring-0 transition duration-200 hover:bg-blue-100"
                >
                  Edit Category
                </button>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        )}
      />
      <AddCategoryModal
        isAddModalOpen={state.isAddModalOpen}
        setOpenAddModal={(open) =>
          dispatch({ type: "set_open_add_modal", open: open })
        }
      />
      <CategoryDetailsModal
        isDetailsModalOpen={state.isDetailsModalOpen}
        categoryDetails={state.dataDetails}
        setOpenDetailsModal={(open) =>
          dispatch({ type: "set_open_details_modal", open: open })
        }
      />
      <CategoryEditModal
        isEditModalOpen={state.isEditModalOpen}
        categoryDetails={state.dataDetails}
        setOpenEditModal={(open) =>
          dispatch({ type: "set_open_edit_modal", open: open })
        }
      />
    </div>
  );
}
