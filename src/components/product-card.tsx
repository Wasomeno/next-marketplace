"use client "

import clsx from "clsx"
import NextImage from "next/image"
import Link from "next/link"
import React from "react"
import { FaStar } from "react-icons/fa"
import { twMerge } from "tailwind-merge"

import { Skeleton } from "./skeleton"

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
          "col-span-5 h-64 border-r-[1.5px] border-b-[1.5px] border-slate-200 p-4 dark:bg-neutral-900 dark:bg-opacity-50 dark:shadow-gray-700 lg:col-span-3 lg:h-auto first:border-l-0 last:border-r-0 [&:nth-child(4n)]:border-r-0",
          className
        )
      )}
      {...props}
    >
      <Link href={href}>{image}</Link>
      <div className="flex w-full flex-col gap-2">
        <div className="space-y-1">
          {name}
          {price}
          {store}
        </div>
        {rating}
      </div>
    </div>
  )
}

const Image = ({ image }: { image: string }) => {
  return (
    <div className="relative h-32 mb-4 w-full overflow-clip bg-slate-50 lg:h-80">
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
  return (
    <div className="overflow-ellipsis font-sans text-xs lg:text-base">
      {name}
    </div>
  )
}

const Price = ({ price }: { price: number }) => {
  return (
    <div className="font-sans text-sm font-bold lg:text-xl">
      Rp {price.toLocaleString("id")}
    </div>
  )
}

const Store = ({ name, slug }: { name: string; slug: string }) => {
  return (
    <Link href={`/${slug}`} className="w-fit">
      <span className="text-sm hover:text-gray-700 duration-200 text-gray-500">
        {name}
      </span>
    </Link>
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

const CardSkeleton = () => {
  return (
    <div className="col-span-5 h-64 border-r-[1.5px] border-b-[1.5px] border-slate-200 p-4 dark:bg-neutral-900 dark:bg-opacity-50 dark:shadow-gray-700 lg:col-span-3 lg:h-auto first:border-l-0 last:border-r-0 [&:nth-child(4n)]:border-r-0">
      <Skeleton className="h-96 rounded-md w-full" />
    </div>
  )
}

ProductCard.Skeleton = CardSkeleton
ProductCard.Image = Image
ProductCard.Rating = Rating
ProductCard.Name = Name
ProductCard.Price = Price
ProductCard.Category = Category
ProductCard.Store = Store

export default ProductCard
