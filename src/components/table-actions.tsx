import React, { HTMLAttributes, ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { BiPencil, BiTrash } from "react-icons/bi"
import { BsEye } from "react-icons/bs"

import { Button } from "./ui/button"

type TableActionsProps = {
  viewAction?: ReactElement
  editAction?: ReactElement
  deleteAction?: ReactElement
}

type BaseActionProps = { asLink?: boolean }

type ButtonActionProps = HTMLAttributes<HTMLButtonElement> &
  BaseActionProps & {
    asLink: false
  }

type LinkActionProps = LinkProps &
  BaseActionProps & {
    asLink: true
  }

type ActionProps = ButtonActionProps | LinkActionProps

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
      <Button
        {...props}
        className="h-7 w-7 rounded-md bg-gray-100 p-1.5 shadow-sm"
      >
        <BsEye />
      </Button>
    )
  } else {
    return (
      <Link
        {...props}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 p-1.5 shadow-sm"
      >
        <BsEye />
      </Link>
    )
  }
}
const EditAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button
        {...props}
        className=" w-7rounded-md h-7 bg-gray-100 p-1.5 shadow-sm"
      >
        <BiPencil />
      </Button>
    )
  } else {
    return (
      <Link
        {...props}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 p-1.5 shadow-sm"
      >
        <BiPencil />
      </Link>
    )
  }
}
const DeleteAction: React.FC<ActionProps> = ({ ...props }) => {
  if (!props.asLink) {
    return (
      <Button
        {...props}
        className=" w-7rounded-md h-7 bg-gray-100 p-1.5 shadow-sm"
      >
        <BiTrash />
      </Button>
    )
  } else {
    return (
      <Link
        {...props}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 p-1.5 shadow-sm"
      >
        <BiTrash />
      </Link>
    )
  }
}

TableActions.View = ViewAction
TableActions.Edit = EditAction
TableActions.Delete = DeleteAction
