"use server"

import { revalidatePath } from "next/cache"
import { UserAddress } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

export async function getUserAddresses(userEmail: string) {
  const addresses = await prisma.userAddress.findMany({
    where: { userEmail },
  })

  return addresses
}

export async function addAddress(
  address: Omit<UserAddress, "userEmail" | "id">
) {
  const session = await getServerSession(authOptions)
  await prisma.userAddress.create({
    data: {
      ...address,
      userEmail: session?.user.email as string,
    },
  })

  revalidatePath("/settings/address")
}

export async function setMainAddress(id: string) {
  const currentMainAddress = await prisma.userAddress.findMany({
    where: { isMainAddress: true },
  })

  await Promise.all(
    currentMainAddress.map((address) =>
      prisma.userAddress.update({
        where: { id: address.id },
        data: { isMainAddress: false },
      })
    )
  )

  await prisma.userAddress.update({
    where: { id: id },
    data: {
      isMainAddress: true,
    },
  })

  revalidatePath("/")
}
