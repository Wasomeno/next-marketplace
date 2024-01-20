"use client "

import React from "react"
import NextImage from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { BiStore } from "react-icons/bi"
import { FaStar } from "react-icons/fa"
import { twMerge } from "tailwind-merge"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode
  name?: React.ReactNode
  price?: React.ReactNode
  category?: React.ReactNode
  rating?: React.ReactNode
  store?: React.ReactNode
  href: string
}

const ProductCard = ({
  image,
  name,
  price,
  category,
  rating,
  href,
  className,
  store,
  ...props
}: ProductCardProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          "col-span-5 h-60 cursor-pointer rounded-md bg-neutral-50 bg-opacity-50 shadow-[0_3px_7px_rgb(0,0,0,0.1)] lg:col-span-2 lg:h-auto dark:bg-neutral-900 dark:bg-opacity-50 dark:shadow-gray-700",
          className
        )
      )}
      {...props}
    >
      <Link href={href}>
        {image}
        <div className="flex w-full flex-col gap-1.5 p-3">
          {name}
          {price}
          {category}
          {store}
          {rating}
        </div>
      </Link>
    </div>
  )
}

const Image = ({ image }: { image: string }) => {
  return (
    <div className="relative h-32 w-full overflow-clip rounded-t-md border bg-slate-50 lg:h-40">
      <NextImage
        src={image}
        alt="product-image"
        className="object-center"
        sizes="(max-width: 320px) 100vw, (max-width: 160px) 50vw, 33vw"
        quality={75}
        fill
      />
    </div>
  )
}

const Rating = ({
  rating,
  reviewCount,
}: {
  rating: number
  reviewCount: number
}) => {
  return (
    <span className="flex items-center gap-1 font-sans text-sm text-gray-500">
      <FaStar size="15" className="fill-yellow-400" />{" "}
      <span>
        {Number.isNaN(rating) ? 0 : rating.toFixed(1)} ({reviewCount})
      </span>
    </span>
  )
}

const Name = ({ name }: { name: string }) => {
  return <span className="font-sans text-xs lg:text-sm">{name}</span>
}

const Price = ({ price }: { price: number }) => {
  return (
    <span className="font-sans text-sm font-medium lg:text-base">
      Rp {price.toLocaleString("id")}
    </span>
  )
}

const StoreName = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center gap-1.5 text-gray-500">
      <BiStore />
      <span className="text-sm">{name}</span>
    </div>
  )
}

const Category = ({
  category,
}: {
  category: { name: string; slug: string }
}) => {
  return (
    <span className="font-sans text-xs text-gray-500 lg:text-sm">
      {category.name}
    </span>
  )
}

const Skeleton = () => {
  return (
    <div className="col-span-5 h-56 cursor-pointer rounded-md shadow-md lg:col-span-2 lg:h-auto dark:shadow-neutral-700">
      <div className="h-32 w-full animate-pulse rounded-t-md bg-slate-300 lg:h-44 dark:bg-neutral-500" />
      <div className="flex w-full flex-col gap-1 p-3">
        <span className="h-6 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-500" />
        <span className="h-6 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-500" />
      </div>
    </div>
  )
}

ProductCard.Skeleton = Skeleton
ProductCard.Image = Image
ProductCard.Rating = Rating
ProductCard.Name = Name
ProductCard.Price = Price
ProductCard.Category = Category
ProductCard.Store = StoreName

export default ProductCard
