"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./react-query-client";

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
