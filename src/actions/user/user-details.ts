"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/config/next-auth"
import { prisma } from "@/lib/prisma"

import { getCachedSession } from "../store/user"

export async function getUserStore({ userEmail }: { userEmail: string }) {
  const store = await prisma.store.findUnique({
    where: { owner_email: userEmail },
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
