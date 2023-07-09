import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaStar } from "react-icons/fa";
import { utapi } from "uploadthing/server";

const ProductCard = ({
  image,
  name,
  price,
  category,
  ratings,
  href,
}: {
  image?: React.ReactNode;
  name?: React.ReactNode;
  price?: React.ReactNode;
  category?: React.ReactNode;
  ratings?: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="col-span-5 h-56 cursor-pointer rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] lg:col-span-2 lg:h-auto"
    >
      {image}
      <div className="flex w-full flex-col gap-1 p-3">
        {name}
        {price}
        {category}
        {ratings}
      </div>
    </Link>
  );
};

const ProductImage = ({ image }: { image: string }) => {
  return (
    <div className="relative h-32 w-full bg-slate-200 lg:h-44">
      <Image src={image} alt="product-image" className="rounded-t-md" fill />
    </div>
  );
};

const Rating = () => {
  return (
    <span className="flex gap-1 font-sans text-sm">
      <FaStar size="15" className="fill-yellow-400" />
    </span>
  );
};

const Name = ({ name }: { name: string }) => {
  return <span className="font-sans text-xs lg:text-sm">{name}</span>;
};

const Price = ({ price }: { price: number }) => {
  return (
    <span className="font-sans text-sm font-medium lg:text-base">
      Rp {price.toLocaleString("id")}
    </span>
  );
};

const Category = ({
  category,
}: {
  category: { name: string; slug: string };
}) => {
  return (
    <span className="font-sans text-xs text-gray-400 lg:text-sm">
      {category.name}
    </span>
  );
};

const Skeleton = () => {
  return (
    <div className="col-span-5 h-56 cursor-pointer rounded-md shadow-md lg:col-span-2 lg:h-auto">
      <div className="h-32 w-full animate-pulse rounded-t-md bg-slate-300 lg:h-44" />
      <div className="flex w-full flex-col gap-1 p-3">
        <span className="h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
        <span className="h-6 w-24 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
};

ProductCard.Skeleton = Skeleton;
ProductCard.Image = ProductImage;
ProductCard.Rating = Rating;
ProductCard.Name = Name;
ProductCard.Price = Price;
ProductCard.Category = Category;

export default ProductCard;
