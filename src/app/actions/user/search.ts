"use server"

import { prisma } from "@/lib/prisma"

async function productSearch(query: string) {
  const products = await prisma.product.findMany({
    where: { name: { contains: query } },
  })
  return products
}

async function storeSearch(query: string) {
  const stores = await prisma.store.findMany({
    where: { name: { contains: query } },
  })
  return stores
}

export async function searchProductsAndStores(query: string) {
  const [products, stores] = await Promise.all([
    productSearch(query),
    storeSearch(query),
  ])

  return { products, stores }
}
