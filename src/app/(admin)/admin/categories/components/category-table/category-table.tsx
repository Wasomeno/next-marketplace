"use client";

import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Category, Prisma, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DeleteCategoriesModal } from "../delete-categories-modal";
import { CategoryTableSearchInput } from "./category-table-search-input";
import {
  CategoryTableSort,
  CategoryTableSorter,
} from "./category-table-sorter";

export const CategoryTable = ({ tableRowMenu }: { tableRowMenu: React.FC }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedSorting, setSelectedSorting] = useState<CategoryTableSort>();

  const categories = useQuery(["categories"], async () => {
    const result = await fetch("/api/categories", { method: "GET" });
    return result.json();
  });

  const columns: ColumnDef<Category>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer accent-blue-300 dark:accent-gray-300"
          checked={
            !categories.isLoading &&
            table.getCoreRowModel().rows.length === selectedCategories.length
          }
          onChange={() => {
            setSelectedCategories((currentSelected) => {
              return table.getCoreRowModel().rows.length ===
                currentSelected.length
                ? []
                : table.getCoreRowModel().rows.map((row) => row.original.id);
            });
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded-md accent-blue-300 dark:accent-gray-300"
            checked={selectedCategories.includes(row.original.id)}
            onChange={() =>
              setSelectedCategories((currentSelected) => {
                if (currentSelected.includes(row.original.id)) {
                  return currentSelected.filter(
                    (categoryId) => categoryId !== row.original.id
                  );
                } else {
                  return [...currentSelected, row.original.id];
                }
              })
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: (category) => category.getValue(),
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (category) => category.getValue(),
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "products",
      header: "Product Amount",
      cell: (category) => {
        const value = category.getValue() as Product[];
        return value.length;
      },
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => tableRowMenu(categories.data[info.row.id]),
    },
  ];

  const table = useReactTable<Category>({
    data: categories.data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-scroll rounded-md border bg-white p-4 lg:p-6">
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <CategoryTableSearchInput
            searchCategory={(category) =>
              table.getColumn("name")?.setFilterValue(category)
            }
          />
          <CategoryTableSorter
            table={table}
            selectedSorting={selectedSorting as CategoryTableSort}
            selectSorting={(sort) => setSelectedSorting(sort)}
          />
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedCategories.length}
            onClick={() => setShowDeleteModal(true)}
            className="hover:scale-[105%]"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-900 lg:text-sm"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="relative border-t border-gray-100">
            {categories.isLoading &&
              ["dummy", "dummy", "dummy", "dummy", "dummy"].map(
                (dummy, index) => (
                  <tr key={index}>
                    {table.getAllColumns().map((column, index) => (
                      <td
                        colSpan={1}
                        className="px-3 py-2 lg:px-6 lg:py-4"
                        key={index}
                      >
                        {column.id === "id" ||
                        column.id === "select" ||
                        column.id === "actions" ? (
                          <div
                            className={twMerge(
                              "mx-auto h-7 w-7 animate-pulse rounded-lg bg-slate-200"
                            )}
                          />
                        ) : (
                          <div
                            className={twMerge(
                              "mx-auto h-7 w-32 animate-pulse rounded-lg bg-slate-200"
                            )}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            {!categories.isLoading && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            className="border-b border-b-gray-200 px-3 py-2 text-center text-xs lg:px-6 lg:py-4 lg:text-sm"
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              : null}
            {!categories.isLoading && !table.getRowModel().rows?.length ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-96 text-center font-medium tracking-wider text-gray-400"
                >
                  No Data
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {!categories.isLoading && (
        <div className="my-2 flex items-center justify-start gap-2.5">
          <Button
            variant="default"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-20 border"
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-20 border"
          >
            Next
          </Button>
        </div>
      )}
      <DeleteCategoriesModal
        selectedCategories={selectedCategories}
        isDeleteModalOpen={showDeleteModal}
        setDeleteModalOpen={(open) => setShowDeleteModal(open)}
      />
    </div>
  );
};
