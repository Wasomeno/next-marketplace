"use client"

import React from "react"
import { useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

import { DataTable } from "@/components/admin/data-table"
import { Option } from "@/components/dropdown"
import { TableActions } from "@/components/table-actions"
import {
  getStoreProductReviews,
  getStoreProductReviewsCount,
} from "@/app/actions/store/review"

import { BaseDataFilters } from "../../../../types"

type ProductReview = Prisma.ProductReviewGetPayload<{
  include: { user: true; product: true }
}>

const pageSize = 5

const reviewsSortOptions: Option[] = [
  { label: "Recent to Old", value: "created_at.desc" },
  { label: "Old to Recent", value: "created_at.asc" },
]

export const StoreProductReviewsTable = () => {
  const searchParamsValues = useSearchParamsValues<BaseDataFilters>()

  const { data: reviewsCount, isLoading: isReviewsCountLoading } = useQuery({
    queryKey: ["storeProductReviewsCount", searchParamsValues?.search],
    queryFn: () =>
      getStoreProductReviewsCount({ search: searchParamsValues?.search }),
  })

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["storeProductReviews", searchParamsValues],
    queryFn: () =>
      getStoreProductReviews({
        ...searchParamsValues,
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
      cell: () => (
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
      ),
    },
    {
      header: "Rating",
      cell: () => (
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
      ),
    },
    {
      header: "User",
      cell: () => (
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
      ),
    },
    {
      header: "Reviewed At",
      cell: () => (
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
      ),
    },
    {
      header: "Actions",
      cell: () => (
        <TableActions viewAction={<TableActions.View asLink={false} />} />
      ),
    },
  ]

  return (
    <>
      {isReviewsCountLoading ? (
        <div className="h-[18px] w-20 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <span className="font text-sm text-gray-500 lg:text-base">
          {reviewsCount} Reviews
        </span>
      )}
      <DataTable
        columns={isReviewsLoading ? placeholderColumns : columns}
        data={
          (isReviewsLoading ? Array(5).fill({}) : reviews) as ProductReview[]
        }
        searchInput={
          <DataTable.SearchInput placeholder="Search by product name" />
        }
        dataSorter={<DataTable.Sorter sortOptions={reviewsSortOptions} />}
        pagination={
          reviewsCount ? (
            <DataTable.Pagination
              dataLength={reviewsCount as number}
              pageSize={pageSize}
            />
          ) : (
            <></>
          )
        }
      />
    </>
  )
}
