"use client"

import React from "react"
import {
  getStoreProductReviews,
  getStoreProductReviewsCount,
} from "@/actions/store/review"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

import { DataTable } from "@/components/data-table"
import { Option } from "@/components/dropdown"
import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

import { TBaseDataFilterParams } from "../../../../../../types"

type ProductReview = Prisma.ProductReviewGetPayload<{
  include: { user: true; product: true }
}>

const pageSize = "5"

const reviewsSortOptions: Option[] = [
  { label: "Recent to Old", value: "created_at.desc" },
  { label: "Old to Recent", value: "created_at.asc" },
]

export const StoreProductReviewsTable = () => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["storeProductReviews", searchParamsValues],
    queryFn: () =>
      getStoreProductReviews({
        ...searchParamsValues,
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
      header: "Reviewed At",
      accessorFn: ({ created_at }) => moment(created_at).format("LLLL"),
    },
    {
      header: "Actions",
      cell: () => (
        <TableActions viewAction={<TableActions.View asLink={false} />} />
      ),
    },
  ]

  const placeholderColumns: ColumnDef<ProductReview>[] = [
    {
      header: "Product Name",
      cell: () => <Skeleton className="h-8 w-20 " />,
    },
    {
      header: "Rating",
      cell: () => <Skeleton className="h-8 w-20 " />,
    },
    {
      header: "User",
      cell: () => <Skeleton className="h-8 w-20 " />,
    },
    {
      header: "Reviewed At",
      cell: () => <Skeleton className="h-8 w-20 " />,
    },
    {
      header: "Actions",
      cell: () => (
        <TableActions viewAction={<TableActions.View asLink={false} />} />
      ),
    },
  ]

  return (
    <DataTable
      columns={isReviewsLoading ? placeholderColumns : columns}
      data={(isReviewsLoading ? Array(5).fill({}) : reviews) as ProductReview[]}
      searchInput={
        <DataTable.SearchInput placeholder="Search by product name" />
      }
      dataSorter={<DataTable.Sorter sortOptions={reviewsSortOptions} />}
      pagination={
        reviews ? (
          <DataTable.Pagination
            dataLength={reviews.length as number}
            pageSize={Number(pageSize)}
          />
        ) : (
          <></>
        )
      }
    />
  )
}
