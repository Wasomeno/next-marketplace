"use server"

import { revalidatePath } from "next/cache"
import { UserAddress } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

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
  await prisma.userAddress.update({
    where: { id: id },
    data: {
      isMainAddress: true,
    },
  })
  revalidatePath("/settings/address")
}
