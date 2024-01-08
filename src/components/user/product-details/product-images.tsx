"use client"

import { useState } from "react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

export const ProductImages = ({ imageUrls }: { imageUrls: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls[0])
  const [activeImage, setActiveImage] = useState(imageUrls[0])
  return (
    <div className="w-full">
      <div className="relative h-80 rounded-md">
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
              "relative h-16 w-16 cursor-pointer rounded-md transition duration-200"
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
