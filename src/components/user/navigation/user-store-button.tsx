import React, { Fragment } from "react"
import Link from "next/link"
import clsx from "clsx"
import { getServerSession } from "next-auth"
import { BiStore } from "react-icons/bi"
import { HiPlus } from "react-icons/hi2"
import invariant from "tiny-invariant"

import { prisma } from "@/lib/prisma"
import { Button, buttonVariants } from "@/components/ui/button"

export async function UserStoreButton() {
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

  if (!session) {
    return
  }

  if (session && !store) {
    return (
      <>
        <Link
          href="/store/create?step=name"
          className={clsx(linkStyle, " hidden items-center gap-2 lg:flex")}
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
        ></Link>
      </>
    )
  }

  invariant(store)

  return (
    <Fragment>
      <Link
        href="/store/home"
        className={clsx(linkStyle, "items-cent hidden gap-2 lg:flex ")}
      >
        <BiStore size={20} />
        {store.name}
      </Link>
      <Link href="/store/home" className="inline-block lg:hidden">
        <BiStore size={20} />
      </Link>
    </Fragment>
  )
}
