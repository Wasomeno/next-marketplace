import React, { Fragment } from "react"
import Link from "next/link"
import clsx from "clsx"
import { getServerSession } from "next-auth"
import { BiStore } from "react-icons/bi"
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
    variant: "default",
  })

  if (!session) {
    return
  }

  if (session && !store) {
    return (
      <Link
        href="/store/create?step=name"
        className={clsx(linkStyle, "hidden lg:inline-block")}
      >
        <BiStore />
        Create Store
      </Link>
    )
  }

  invariant(store)

  return (
    <Fragment>
      <Link
        href="/store/home"
        className={clsx(linkStyle, "hidden lg:inline-block")}
      >
        {store.name}
      </Link>
      <Link href="/store/home" className="inline-block lg:hidden">
        <BiStore size={20} />
      </Link>
    </Fragment>
  )
}
