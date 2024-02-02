"use server"

import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"

export async function getUserInvoices() {
  const session = await getServerSession()

  const invoices = await prisma.invoice.findMany({
    where: {
      order: { user_email: session?.user.email as string },
    },
    include: {
      products: {
        include: { product: { include: { images: true } } },
      },
      _count: { select: { products: true } },
    },
  })
  return invoices
}

export async function getUserInvoice(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      products: {
        include: { product: { include: { images: true } } },
      },
      _count: { select: { products: true } },
    },
  })

  return invoice
}
