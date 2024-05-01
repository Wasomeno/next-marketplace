"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

export async function getUserStore() {
  const session = await getServerSession(authOptions)
  const store = await prisma.store.findUnique({
    where: { owner_email: session?.user?.email as string },
  })

  return store
}

export async function getUserAddress() {
  const session = await getServerSession(authOptions)

  const addresses = await prisma.userAddress.findMany({
    where: { userEmail: session?.user.email as string, isMainAddress: true },
  })

  return addresses[0]
}
