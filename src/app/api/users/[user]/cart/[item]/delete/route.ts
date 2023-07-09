import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: { user: string; item: string } }
) {
  const { item } = context.params;
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(item) } });
    revalidateTag("cartItemCount");
    return NextResponse.json({
      revalidate: true,
      message: "Successfully deleted item",
    });
  } catch (error) {
    return NextResponse.json(error);
  }
}
