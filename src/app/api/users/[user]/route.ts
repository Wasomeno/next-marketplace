import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  const { user } = context.params;
  return await prisma.user.findUnique({ where: { email: user } });
}
