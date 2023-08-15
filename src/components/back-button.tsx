"use client";

import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

import { Button } from "./ui/button";

export const BackButton = ({
  size,
  text,
}: {
  size?: string | number;
  text?: string;
}) => {
  const { back } = useRouter();
  return (
    <Button onClick={back} className="flex gap-2 bg-transparent p-3 lg:hidden">
      <BsArrowLeft size={size ?? 16} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </Button>
  );
};
