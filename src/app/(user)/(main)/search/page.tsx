import { Metadata } from "next"

import { Products } from "@/components/user/products"

type Props = {
  searchParams: {
    q: string
    pmin: string
    pmax: string
    sort: string
    category: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Search`,
  }
}

export default async function SearchPage({ searchParams }: Props) {
  return <Products />
}
