import clsx from "clsx"
import { getServerSession } from "next-auth"
import Link from "next/link"
import React, { Fragment } from "react"
import { BiStore } from "react-icons/bi"
import { HiPlus } from "react-icons/hi2"
import invariant from "tiny-invariant"

import { buttonVariants } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export async function StoreButton() {
  const session = await getServerSession()
  const store = await prisma.store.findUnique({
    where: {
      owner_email: session?.user.email ?? "",
    },
  })

  const linkStyle = buttonVariants({
    className: "gap-2",
    size: "default",
    variant: "defaultOutline",
  })

  if (!session || session.user.role === "admin") {
    return
  }

  if (session && !store) {
    return (
      <>
        <Link
          href="/store/create?step=name"
          className={clsx(linkStyle, "hidden items-center gap-2 lg:flex")}
        >
          <div className="relative">
            <div className="absolute -right-[4px] -top-[4px] flex h-3 w-3 items-center justify-center rounded-full bg-blue-400 text-white shadow-sm">
              <HiPlus size={10} />
            </div>
            <BiStore size={20} />
          </div>
          <span>Create Your Store</span>
        </Link>
        <Link
          href="/store/create?step=name"
          className="relative inline-block lg:hidden"
        >
          <div className="relative">
            <div className="absolute -right-[4px] -top-[4px] flex h-3 w-3 items-center justify-center rounded-full bg-blue-400 text-white shadow-sm">
              <HiPlus size={10} />
            </div>
            <BiStore size={20} />
          </div>
        </Link>
      </>
    )
  }

  invariant(store)

  return (
    <Fragment>
      <Link href="/store/home">
        <BiStore className=" w-6 h-6" />
      </Link>
      <Link href="/store/home" className="inline-block lg:hidden">
        <BiStore className=" w-6 h-6" />
      </Link>
    </Fragment>
  )
}
