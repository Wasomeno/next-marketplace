import { Metadata } from "next"
import React, { Suspense } from "react"

import { BannerTable } from "./_components/banner-table"
import { CreateBannerModal } from "./_components/create-banner-modal"
import { EditBannerModal } from "./_components/edit-banner-modal"

export const metadata: Metadata = {
  title: "Promo Banners",
}

export default async function BannersPage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6">
      <h1 className="text-base font-medium lg:text-2xl">Promo Banners</h1>
      <BannerTable />
      <CreateBannerModal />
      <EditBannerModal />
    </div>
  )
}
