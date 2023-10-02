"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Input } from "../ui/input"

export const ProductPriceFilter = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [price, setPrice] = useState({
    min: searchParams.get("pmin") ?? "0",
    max: searchParams.get("pmax") ?? "0",
  })

  function onPriceChange(price: { min: string; max: string }) {
    setPrice(price)
    const newParams = new URLSearchParams(searchParams.toString())
    price.min !== "0" && newParams.set("pmin", price.min)
    price.max !== "0" && newParams.set("pmax", price.max)
    const url = `${pathname}?${newParams.toString()}`
    setTimeout(() => router.push(url), 750)
  }

  return (
    <div>
      <h6 className="text-xs font-medium tracking-wide lg:text-sm">Price</h6>
      <div className="mt-2 flex gap-2">
        <Input
          type="number"
          placeholder="Min Price"
          className="text-xs dark:border-gray-800 dark:bg-neutral-900 lg:text-sm"
          value={price.min}
          onChange={(event) =>
            onPriceChange({ ...price, min: event?.target.value })
          }
        />
        <Input
          type="number"
          placeholder="Max Price"
          className="text-xs dark:border-gray-800 dark:bg-neutral-900 lg:text-sm"
          value={price.max}
          onChange={(event) =>
            onPriceChange({ ...price, max: event?.target.value })
          }
        />
      </div>
    </div>
  )
}
