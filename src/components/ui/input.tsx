import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          clsx(
            "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
