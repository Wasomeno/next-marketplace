import { useMemo, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Category, Product, ProductImage } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DeleteProductsModal } from "../delete-products-modal";
import { productsTableColumns } from "./products-table-columns";
import { ProductsTableSearchInput } from "./products-table-search-input";
import { ProductSorting, ProductsTableSorter } from "./table-sorter";

export interface ProductWithImages extends Product {
  images: ProductImage[];
  category: Category;
}

interface ProductTableProps {
  tableRowMenu: React.FC;
}

export const ProductsTable = ({ tableRowMenu }: ProductTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<number>>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState<ProductSorting>();

  const products = useQuery(
    ["products"],
    async (): Promise<Array<ProductWithImages>> => {
      const result = await fetch("/api/products", { method: "GET" });
      return result.json();
    }
  );

  const columns = useMemo(
    () =>
      productsTableColumns({
        tableRowMenu: {
          id: "action",
          header: "Actions",
          cell: ({ row }) => {
            return tableRowMenu(row.original);
          },
        },
        checkBox: {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer p-1.5"
              checked={
                !products.isLoading &&
                table.getCoreRowModel().rows.length === selectedProducts.length
              }
              onChange={() => {
                setSelectedProducts((currentSelected) => {
                  return table.getCoreRowModel().rows.length ===
                    currentSelected.length
                    ? []
                    : table
                        .getCoreRowModel()
                        .rows.map((row) => row.original.id);
                });
              }}
            />
          ),
          cell: ({ row }) => (
            <div className="px-1">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded-md accent-blue-300 dark:accent-gray-300"
                checked={selectedProducts.includes(row.original.id)}
                onChange={() =>
                  setSelectedProducts((currentSelected) => {
                    if (currentSelected.includes(row.original.id)) {
                      return currentSelected.filter(
                        (productId) => productId !== row.original.id
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
      }),
    [products.data]
  );

  const table = useReactTable<ProductWithImages>({
    data: products.data as ProductWithImages[],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex w-full flex-1 flex-col rounded-md border bg-white p-4 lg:p-6">
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <ProductsTableSearchInput
            searchProducts={(product) =>
              table.getColumn("name")?.setFilterValue(product)
            }
          />
          <ProductsTableSorter
            table={table}
            selectedSorting={selectedSorting as ProductSorting}
            selectSorting={(sorting) => setSelectedSorting(sorting)}
          />
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedProducts.length}
            onClick={() => setShowDeleteModal(true)}
            className="h-8 w-8 px-0 hover:scale-[105%] lg:h-10 lg:w-10"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} aria-rowspan={1}>
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
          <tbody className="relative divide-y divide-gray-100 border-t border-gray-100">
            {products.isLoading &&
              ["dummy", "dummy", "dummy", "dummy", "dummy"].map(
                (dummy, index) => (
                  <tr key={index}>
                    {table.getAllColumns().map((column, index) => (
                      <td className="px-3 py-2 lg:px-6 lg:py-4" key={index}>
                        {column.id === "id" ||
                        column.id === "select" ||
                        column.id === "action" ? (
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

            {!products.isLoading && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="px-3 py-2 text-center text-xs lg:px-6 lg:py-4 lg:text-sm"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {!products.isLoading && !table.getRowModel().rows?.length ? (
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
      {!products.isLoading && (
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
      <DeleteProductsModal
        selectedProducts={selectedProducts}
        isDeleteModalOpen={showDeleteModal}
        setDeleteModalOpen={(open) => setShowDeleteModal(open)}
      />
    </div>
  );
};
