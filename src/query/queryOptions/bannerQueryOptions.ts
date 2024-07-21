import { getBanners } from "@/actions/admin/banner"
import { getParsedSortParams } from "@/utils"
import { queryOptions } from "@tanstack/react-query"

import { TBaseDataFilterParams } from "../../../types"

export const bannersQuery = (params?: TBaseDataFilterParams) =>
  queryOptions({
    queryKey: [
      "banners",
      params?.page,
      params?.pageSize,
      params?.search,
      params?.sort,
    ],
    queryFn: () =>
      getBanners({
        ...params,
        sort: getParsedSortParams(params?.sort),
      }),
  })
