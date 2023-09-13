import { IconType } from "react-icons"
import { BiCategory } from "react-icons/bi"
import { BsCardList, BsHouseDoor } from "react-icons/bs"

type UserMobilePath = {
  title: string
  href: string
  Icon: IconType
}

export const userMobilePaths: UserMobilePath[] = [
  {
    title: "Home",
    href: "/",
    Icon: BsHouseDoor,
  },
  {
    title: "Categories",
    href: "/categories",
    Icon: BiCategory,
  },
  {
    title: "Orders",
    href: "/orders",
    Icon: BsCardList,
  },
]
