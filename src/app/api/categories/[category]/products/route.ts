import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: any }) {
  const { category } = context.params;
  const { priceFilter, productSort } = await request.json();
  const categoryDetails = await prisma.category.findUnique({
    where: { slug: category },
    include: {
      products: {
        include: {
          category: true,
          images: { select: { image_url: true } },
        },
        orderBy: productSort.sort,
        where: {
          price: {
            gte: priceFilter.min,
            lte: priceFilter.max,
          },
        },
      },
    },
  });

  return NextResponse.json(categoryDetails);
}
