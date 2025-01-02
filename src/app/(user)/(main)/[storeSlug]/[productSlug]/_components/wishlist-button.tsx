"use client"

import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "@/actions/user/wishlist"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export const WishListButton = ({ isWishlisted }: { isWishlisted: boolean }) => {
  const [isPending, startTransition] = useTransition()
  const { productSlug } = useParams()

  const router = useRouter()

  const session = useSession()

  async function addToWishlist() {
    if (session.data?.user.email) {
      await addProductToWishlist(productSlug as string)
      toast.success("Added to wishlist")
    } else {
      router.push("/login")
    }
  }

  async function removeFromWishlist() {
    if (session.data?.user.email) {
      await removeProductFromWishlist(productSlug as string)
      toast.error("Removed from wishlist")
    } else {
      router.push("/login")
    }
  }

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          if (!isWishlisted) {
            await addToWishlist()
          } else {
            await removeFromWishlist()
          }
        })
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="w-5 lg:w-7"
        animate={{ scale: isWishlisted ? 1.2 : 1.0 }}
        transition={{
          type: "spring",
          bounce: 0.5,
          duration: 0.75,
        }}
      >
        <motion.path
          initial={{ fill: "rgb(203 213 225)" }}
          animate={{
            fill: isWishlisted ? "rgb(220 38 38)" : "rgb(203 213 225)",
          }}
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
