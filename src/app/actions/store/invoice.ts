"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { OrderStatus } from "../../../../types"
import { getUserStore } from "../user/user-details"

export async function getStoreInvoices() {
  const store = await getUserStore()

  const invoices = await prisma.invoice.findMany({
    where: {
      store_id: store?.id,
    },
    include: {
      products: {
        where: { product: { store_id: store?.id } },
        include: { product: { include: { images: true } } },
      },
      _count: { select: { products: true } },
    },
  })
  return invoices
}

export async function getStoreInvoice(invoiceId: string) {
  const store = await getUserStore()

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      store_id: store?.id,
    },
    include: {
      products: {
        where: { product: { store_id: store?.id } },
        include: { product: { include: { images: true } } },
      },
      _count: { select: { products: true } },
    },
  })

  return invoice
}

export async function updateInvoiceStatus({
  invoiceId,
  status,
}: {
  invoiceId: string
  status: OrderStatus
}) {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
      },
    })
  } catch (error) {
    throw error
  }

  revalidatePath("/store/orders")
}
