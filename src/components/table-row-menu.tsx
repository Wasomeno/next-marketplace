import React, { ReactElement } from "react"
import Link, { LinkProps } from "next/link"
import { BiPencil, BiTrash } from "react-icons/bi"
import { BsEye } from "react-icons/bs"

type TableActionsProps = {
  viewAction?: ReactElement
  editAction?: ReactElement
  deleteAction?: ReactElement
}

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

const ViewAction: React.FC<LinkProps> = ({ ...props }) => {
  return (
    <Link {...props} className="rounded-md border border-gray-200 p-1.5">
      <BsEye />
    </Link>
  )
}
const EditAction: React.FC<LinkProps> = ({ ...props }) => {
  return (
    <Link {...props} className="rounded-md border border-gray-200 p-1.5">
      <BiPencil />
    </Link>
  )
}
const DeleteAction: React.FC<LinkProps> = ({ ...props }) => {
  return (
    <Link {...props} className="rounded-md border border-gray-200 p-1.5">
      <BiTrash />
    </Link>
  )
}

TableActions.View = ViewAction
TableActions.Edit = EditAction
TableActions.Delete = DeleteAction
