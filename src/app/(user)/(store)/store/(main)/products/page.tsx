import { Metadata } from "next";
import { getServerSession } from "next-auth";
import invariant from "tiny-invariant";

import { getStoreProducts } from "@/actions/store/store";
import { queryClient } from "@/lib/react-query-client";
import { productQueryKeys } from "@/modules/user/common/queryKeys/productQueryKeys";
import { ProductCount } from "@/modules/user/store/product-page/components/product-count";
import { ProductTable } from "@/modules/user/store/product-page/components/product-table";
import { getParsedSortParams } from "@/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { TBaseDataFilterParams } from "../../../../../../../types";

export const metadata: Metadata = {
  title: "My Store Products",
}

type Props = {
  searchParams: TBaseDataFilterParams & {
    status: string
    categories: string
    delete: string
    id: string
  }
}

export default async function UserStoreProductsPage({ searchParams }: Props) {
  const session = await getServerSession()

  invariant(session?.user.email, "Invalid Session")

  const initial = queryClient.getQueryData([
    productQueryKeys.userStore(session.user.email),
    searchParams.status,
    searchParams.sort,
    searchParams.categories,
  ])

  if (!initial) {
    await queryClient.prefetchQuery({
      queryKey: [
        productQueryKeys.userStore(session.user.email),
        searchParams.status,
        searchParams.sort,
        searchParams.categories,
        searchParams.search,
      ],
      queryFn: async () =>
        getStoreProducts({
          ...searchParams,
          userEmail: session.user.email as string,
          sort: {
            [searchParams.sort?.split("."[0])[0]]: searchParams.sort?.split(
              "."
            )[1] as "asc" | "desc",
          },
          pageSize: "5",
          categoryIds: searchParams?.categories
            ?.split(" ")
            ?.map((categoryId) => parseInt(categoryId)),
        }),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Products</h1>
        <ProductCount />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductTable userEmail={session.user.email} />
      </HydrationBoundary>
    </div>
  )
}
