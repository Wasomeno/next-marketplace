"use client"

import { searchProductsAndStores } from "@/actions/user/search"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useRef, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { HiXMark } from "react-icons/hi2"
import { ImSpinner8 } from "react-icons/im"
import { LiaStackExchange } from "react-icons/lia"

import { NoData } from "@/components/no-data"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [isModalActive, setIsModalActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchProductsAndStores(searchQuery),
    enabled: isModalActive && searchQuery.length > 1,
  })

  function search(event: ChangeEvent<HTMLInputElement>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(
      () => setSearchQuery(event.target.value),
      750
    )
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const pageTarget = "/discover"
    const searchParams = new URLSearchParams()
    searchParams.set("q", searchQuery)

    if (searchQuery.length > 0) {
      router.push(`${pageTarget}?${searchParams.toString()}`)
    }
  }

  return (
    <div className="flex items-center gap-2 lg:relative lg:block">
      {isModalActive && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsModalActive(false)}
          className="lg:hidden"
        >
          <HiXMark size={18} />
        </motion.button>
      )}
      <form onSubmit={submit} className="w-full lg:w-96">
        <Input
          ref={searchInputRef as any}
          placeholder="Search..."
          className="h-8 w-full rounded-md border bg-slate-50 p-2 font-sans text-xs dark:border-gray-700 dark:bg-slate-950 lg:h-10 lg:text-sm"
          onFocus={() => setIsModalActive(true)}
          onBlur={() => setIsModalActive(false)}
          onChange={search}
        />
      </form>
      <AnimatePresence>
        {isModalActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              className="absolute left-0 top-14 z-20 h-screen w-screen rounded-lg border  border-gray-200 bg-white px-4 py-2 lg:top-12 lg:h-72 lg:w-96 "
            >
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center">
                  <ImSpinner8
                    className="animate-spin text-blue-500"
                    size={30}
                  />
                </div>
              )}

              {!isLoading && data?.products && data?.stores ? (
                <div className="h-full w-full space-y-4">
                  {data.products.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Products</span>
                      <div className="flex flex-col gap-2">
                        {data.products.map((product) => (
                          <Link
                            href={`/${product.store.slug}/${product.slug}`}
                            key={product.id}
                            className="text-sm"
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.stores.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Stores</span>
                      <div className="flex flex-col gap-2">
                        {data.stores.map((store) => (
                          <Link
                            href={`/stores/${store.name.toLowerCase()}`}
                            key={store.id}
                            className="text-sm"
                          >
                            {store.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.stores.length === 0 && data.products.length === 0 && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                      <NoData
                        icon={<LiaStackExchange size={20} />}
                        text="Not found"
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {!isLoading && searchQuery.length < 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                  <BiSearch size={25} />
                  <span className="w-32 text-center text-sm">
                    Search by product or store name
                  </span>
                </div>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
