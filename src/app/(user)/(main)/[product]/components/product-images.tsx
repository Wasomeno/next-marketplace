"use client";

import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const ProductImages = ({ imageUrls }: { imageUrls: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(imageUrls[0]);
  const [activeImage, setActiveImage] = useState(imageUrls[0]);
  return (
    <div className="w-10/12 lg:w-4/12">
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
              "relative h-16 w-16 cursor-pointer rounded-md border-2 transition duration-200 hover:border-blue-300",
              selectedImage === url && "border-blue-300"
            )}
          >
            <Image src={url} alt="product-images" className="rounded-md" fill />
          </div>
        ))}
      </div>
    </div>
  );
};
