import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const res = await request.json();
  try {
    await prisma.category.deleteMany({
      where: { id: { in: res.categoryIds } },
    });
    return NextResponse.json({ message: "Successfully deleted categories" });
  } catch (error) {
    return NextResponse.error();
  }
}
