import "./globals.css"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Metadata } from "next"
import { IoIosCloseCircle } from "react-icons/io"
import { IoCheckmarkCircle } from "react-icons/io5"

import { DataTable } from "@/components/data-table"
import ClientSessionProvider from "@/components/session-provider"
import { ThemeClientProvider } from "@/components/theme-client-provider"
import { Toaster } from "@/components/toaster"
import { ReactQueryProvider } from "@/lib/react-query-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: {
    default: "Next Marketplace",
    template: "%s | Next Marketplace",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientSessionProvider>
        <ReactQueryProvider>
          <body className="flex min-h-screen flex-1 flex-col overflow-y-scroll antialiased dark:bg-slate-950">
            <ThemeClientProvider>
              <Suspense fallback={<div className="flex h-full w-full" />}>
                {children}
              </Suspense>
              <div className="fixed" />
            </ThemeClientProvider>
            <Toaster
              icons={{
                success: (
                  <IoCheckmarkCircle className="text-green-600" size={18} />
                ),
                error: <IoIosCloseCircle className="text-red-600" size={18} />,
              }}
            />
            <ReactQueryDevtools />
          </body>
        </ReactQueryProvider>
      </ClientSessionProvider>
    </html>
  )
}
