import React, { ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { BiPencil, BiTrash } from "react-icons/bi"
import { BsEye } from "react-icons/bs"
import { twMerge } from "tailwind-merge"

import { Button, ButtonProps, buttonVariants } from "./ui/button"

type TableActionsProps = {
  viewAction?: ReactElement
  editAction?: ReactElement
  deleteAction?: ReactElement
}

type ButtonActionProps = { asLink: false } & ButtonProps

type LinkActionProps = {
  asLink: true
} & LinkProps

type ActionProps = ButtonActionProps | LinkActionProps

const linkStyle = twMerge(
  buttonVariants({
    size: "sm",
    variant: "defaultOutline",
    className: "h-7 w-7 shadow-sm p-0 px-0 py-0",
  })
)

const buttonStyle = "h-7 w-7 shadow-sm p-0 px-0 py-0"

export function TableActions({
  viewAction,
  editAction,
  deleteAction,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {viewAction}
      {editAction}
      {deleteAction}
    </div>
  )
}

const ViewAction: React.FC<ActionProps> = (props) => {
  if (!props.asLink) {
    return (
      <Button {...props} variant="defaultOutline" className={buttonStyle}>
        <BsEye />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={linkStyle}>
        <BsEye />
      </Link>
    )
  }
}
const EditAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button {...props} variant="defaultOutline" className={buttonStyle}>
        <BiPencil />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={linkStyle}>
        <BiPencil />
      </Link>
    )
  }
}
const DeleteAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button {...props} variant="defaultOutline" className={buttonStyle}>
        <BiTrash />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={linkStyle}>
        <BiTrash />
      </Link>
    )
  }
}

TableActions.View = ViewAction
TableActions.Edit = EditAction
TableActions.Delete = DeleteAction
