import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "flex lg:text-sm text-xs font-medium transition duration-300 disabled:opacity-50 items-center rounded-md justify-center",
  {
    variants: {
      variant: {
        default: "bg-slate-100",
        defaultOutline: "border border-slate-100",
        danger: "bg-red-600",
        warning: "bg-yellow-500",
        success: "bg-green-600",
        dangerOutline: "border border-red-600",
        successOutline: "border border-green-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2.5 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(clsx(buttonVariants({ variant, size, className })))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
