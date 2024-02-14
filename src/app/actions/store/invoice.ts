"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

import { BaseDataFilters, OrderStatus } from "../../../../types"
import { getUserStore } from "../user/user-details"

type GetStoreInvoicesProps = BaseDataFilters

export async function getStoreInvoices(props?: GetStoreInvoicesProps) {
  const store = await getUserStore()

  const invoices = await prisma.invoice.findMany({
    orderBy: props?.sort,
    skip: (props?.page ? props.page - 1 : 0) * (props?.pageSize ?? 5),
    take: props?.pageSize ?? 5,
    where: {
      id: { contains: props?.search },
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

export async function getStoreInvoicesCount(
  props: Pick<BaseDataFilters, "search">
) {
  const store = await getUserStore()

  const orderTotalAmount = await prisma.invoice.count({
    where: { store_id: store?.id, id: { contains: props?.search } },
  })

  return orderTotalAmount
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
