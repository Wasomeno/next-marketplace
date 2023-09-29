import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request, context: any) {
  const { user } = context.params
  const userDetails = await prisma.user.findUnique({ where: { email: user } })
  return NextResponse.json(userDetails)
}
