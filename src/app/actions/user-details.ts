"use server"

import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

import { authOptions } from "../api/auth/[...nextauth]/route"

export async function getUserAddress() {
  const session = await getServerSession(authOptions)
  const userDetails = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
    select: { address: true },
  })

  return userDetails?.address ?? ""
}
