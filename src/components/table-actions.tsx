import React, { HTMLAttributes, ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { BiPencil, BiTrash } from "react-icons/bi"
import { BsEye } from "react-icons/bs"

import { Button, ButtonProps } from "./ui/button"

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

const LinkStyle =
  "flex h-7 w-7 items-center transition-all duration-300 hover:bg-gray-200 justify-center rounded-md bg-gray-100 p-1.5 shadow-sm"
const ButtonStyle = "h-7 w-7 rounded-md bg-gray-100 p-1.5 shadow-sm"
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
      <Button {...props} className={ButtonStyle}>
        <BsEye />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={LinkStyle}>
        <BsEye />
      </Link>
    )
  }
}
const EditAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button {...props} className={ButtonStyle}>
        <BiPencil />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={LinkStyle}>
        <BiPencil />
      </Link>
    )
  }
}
const DeleteAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button {...props} className={ButtonStyle}>
        <BiTrash />
      </Button>
    )
  } else {
    return (
      <Link {...props} className={LinkStyle}>
        <BiTrash />
      </Link>
    )
  }
}

TableActions.View = ViewAction
TableActions.Edit = EditAction
TableActions.Delete = DeleteAction
