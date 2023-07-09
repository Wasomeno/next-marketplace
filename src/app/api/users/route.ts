import { prisma } from "@/lib/prisma";

export async function GET() {
  return await prisma.user.findMany();
}
