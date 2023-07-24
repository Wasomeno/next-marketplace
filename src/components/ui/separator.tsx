"use client";

import React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <SeparatorPrimitive.Root ref={ref} className={className} />;
});

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
