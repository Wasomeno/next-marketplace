import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const res = await request.json();
  try {
    await prisma.product.deleteMany({
      where: { id: { in: res.productIds } },
    });
    return NextResponse.json({ message: "Successfully deleted products" });
  } catch (error) {
    return NextResponse.error();
  }
}
