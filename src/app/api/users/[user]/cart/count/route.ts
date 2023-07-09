import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { user: string } }
) {
  const { user } = context.params;
  const itemsAmount = await prisma.cart.findUnique({
    where: { user_email: user },
    select: { _count: { select: { items: true } } },
  });

  return NextResponse.json(itemsAmount?._count.items);
}
