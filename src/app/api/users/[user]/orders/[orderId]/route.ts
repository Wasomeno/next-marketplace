import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  const { orderId } = context.params;
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { products: true, status: true },
  });
}

export async function PATCH(request: Request, context: any) {
  const { orderId } = context.params;
}
