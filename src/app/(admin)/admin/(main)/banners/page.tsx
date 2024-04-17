import React from "react"
import { BannerTable } from "@/modules/admin/banner-page/components/banner-table"

import { prisma } from "@/lib/prisma"

export default async function BannersPage() {
  const banners = await prisma.banner.findMany()
  return (
    <div className="flex w-full flex-1 flex-col bg-slate-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Promo Banners
        </h1>
      </div>
      <BannerTable banners={banners} />
    </div>
  )
}
