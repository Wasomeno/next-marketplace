"use client"

import Image from "next/image"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

export const ProductImages = ({ imageUrls }: { imageUrls: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls[0])
  const [activeImage, setActiveImage] = useState(imageUrls[0])
  return (
    <div className="flex w-full flex-col lg:items-start">
      <div className="relative h-80 lg:h-[50rem] w-full self-center overflow-hidden rounded-md">
        <Image src={activeImage} alt="product-image-main" fill />
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            onMouseOver={() => setActiveImage(url)}
            onMouseLeave={() => setActiveImage(selectedImage)}
            onClick={() => setSelectedImage(url)}
            className={twMerge(
              "relative w-24 h-24 lg:h-32 lg:w-32 cursor-pointer rounded-md transition duration-200"
            )}
          >
            <Image
              src={url}
              alt="product-images"
              className={twMerge(
                "rounded-md border-2 hover:border-blue-300 hover:dark:border-blue-500",
                selectedImage === url && "border-blue-300 dark:border-blue-500"
              )}
              fill
            />
          </div>
        ))}
      </div>
    </div>
  )
}
