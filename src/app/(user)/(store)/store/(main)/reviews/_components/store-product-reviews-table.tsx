"use client"

import moment from "moment"
import React from "react"

import { getStoreProductReviews } from "@/actions/store/review"
import { DataTable } from "@/components/data-table"
import { Option } from "@/components/dropdown"
import { TableActions } from "@/components/table-actions"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"

import { TBaseDataFilterParams } from "../../../../../../../../types"
import { storeQueryKeys } from "../../../_query/keys"

type ProductReview = Prisma.ProductReviewGetPayload<{
  include: { user: true; product: true }
}>

const pageSize = "5"

const reviewsSortOptions: Option[] = [
  { label: "Recent to Old", value: "created_at.desc" },
  { label: "Old to Recent", value: "created_at.asc" },
]

export const StoreProductReviewsTable: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const reviews = useQuery({
    queryKey: storeQueryKeys.reviews({ ...searchParamsValues, storeId }),
    queryFn: () =>
      getStoreProductReviews({
        ...searchParamsValues,
        storeId,
        sort: getParsedSortParams(searchParamsValues.sort),
        pageSize,
      }),
  })

  const columns: ColumnDef<ProductReview>[] = [
    { header: "Product Name", accessorFn: ({ product }) => product.name },
    {
      header: "Rating",
      accessorKey: "rating",
    },
    { header: "User", accessorFn: ({ user }) => user.email },
    {
      header: "Created at",
      accessorFn: ({ created_at }) => moment(created_at).format("LLLL"),
    },
    {
      header: "Actions",
      cell: () => <TableActions view={<TableActions.View type="button" />} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      isLoading={reviews.isLoading}
      data={reviews.data ?? Array(5).fill("")}
      searchInput={
        <DataTable.SearchInput
          placeholder="Search by product name"
          disabled={reviews.isLoading}
        />
      }
      dataSorter={
        <DataTable.Sorter
          sortOptions={reviewsSortOptions}
          disabled={reviews.isLoading}
        />
      }
      pagination={
        reviews.data?.length ? (
          <DataTable.Pagination
            dataLength={reviews.data.length}
            pageSize={Number(pageSize)}
          />
        ) : (
          <></>
        )
      }
    />
  )
}
