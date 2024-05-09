"use server"

import { Banner } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { TBaseDataFilter } from "../../../types"

type CreateBannerParams = Omit<Banner, "id">
type EditBannerParams = {
  id: number
  url?: string
  name: string
}

type GetAllBannersParams = TBaseDataFilter

export async function createBanner(params: CreateBannerParams) {
  try {
    await prisma.banner.create({
      data: params,
    })
  } catch (error) {
    throw error
  }
}

export async function updateBanner(params: EditBannerParams) {
  console.log(params)
  try {
    await prisma.banner.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
        url: params.url,
      },
    })
  } catch (error) {
    throw error
  }
}

export async function getBanner(params: { id: number }) {
  const banner = await prisma.banner.findUnique({
    where: { id: params.id },
  })

  return banner
}

export async function getBanners(params: GetAllBannersParams) {
  const banners = await prisma.banner.findMany({
    where: {
      name: { contains: params.search, mode: "insensitive" },
    },
    orderBy: params?.sort,
    skip:
      (params.page ? Number(params.page) - 1 : 0) *
      (Number(params.pageSize) ?? 5),
    take: Number(params.pageSize) ?? 5,
  })

  return banners
}

export async function deleteMultipleBanners({ ids }: { ids: Array<number> }) {
  try {
    await prisma.banner.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  } catch (error) {
    throw error
  }
}

export async function deleteSingleBanner({ id }: { id: number }) {
  try {
    await prisma.banner.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    throw error
  }
}
