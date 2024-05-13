import "./globals.css"

import { Metadata } from "next"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { IoIosCloseCircle } from "react-icons/io"
import { IoCheckmarkCircle } from "react-icons/io5"

import { ReactQueryProvider } from "@/lib/react-query-provider"
import ClientSessionProvider from "@/components/session-provider"
import { ThemeClientProvider } from "@/components/theme-client-provider"
import { Toaster } from "@/components/toaster"

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
              {children}
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
          </body>
          <ReactQueryDevtools />
        </ReactQueryProvider>
      </ClientSessionProvider>
    </html>
  )
}
