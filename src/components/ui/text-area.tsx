import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={twMerge(
          clsx(
            "border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
