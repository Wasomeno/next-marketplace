"use client"

import React from "react"
import { getStoreProductReviews } from "@/actions/store/review"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
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

export const StoreProductReviewsTable: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
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
      header: "Created at",
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
        reviews?.length ? (
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
