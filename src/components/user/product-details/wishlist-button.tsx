"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

import {
  addToWishlist,
  removeProductFromWishlist,
} from "@/app/actions/wishlist"

export const WishListButton = ({
  isProductInWishlist,
}: {
  isProductInWishlist: boolean
}) => {
  const [isActive, setIsActive] = useState(isProductInWishlist)
  const [isPending, startTransition] = useTransition()

  const { product } = useParams()
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          if (!isActive) {
            await addToWishlist(parseInt(product as string))
            setIsActive(true)
            toast.success("Added to wishlist")
          } else {
            await removeProductFromWishlist(parseInt(product as string))
            setIsActive(false)
            toast.error("Remove from wishlist")
          }
        })
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="w-5 lg:w-5"
        animate={{ scale: isActive ? 1.2 : 1.0 }}
        transition={{
          type: "spring",
          bounce: 0.5,
          duration: 0.75,
        }}
      >
        <motion.path
          initial={{ fill: "rgb(203 213 225)" }}
          animate={{ fill: isActive ? "rgb(220 38 38)" : "rgb(203 213 225)" }}
          transition={{
            type: "spring",
            bounce: 0.5,
            duration: 0.75,
          }}
          d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
        />
      </motion.svg>
    </button>
  )
}
