import React from "react"
import { Metadata } from "next"
import invariant from "tiny-invariant"

import { getStore } from "@/app/actions/store"

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore()
  return {
    title: store?.name,
  }
}

export default async function UserStorePage() {
  const store = await getStore()

  invariant(store)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Dashboard</h1>
    </div>
  )
}
