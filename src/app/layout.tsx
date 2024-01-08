import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

import { ReactQueryProvider } from "@/lib/react-query-provider"
import ClientSessionProvider from "@/components/session-provider"
import { ThemeClientProvider } from "@/components/theme-client-provider"
import ToastifyContainer from "@/components/toastify-client-container"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientSessionProvider>
        <ReactQueryProvider>
          <body className="bg-slate-50 antialiased dark:bg-slate-950">
            <ThemeClientProvider>
              {children}
              <div className="fixed" />
            </ThemeClientProvider>
            <ToastifyContainer
              closeButton={false}
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={true}
              toastClassName="bg-white border border-slate-300 dark:border-gray-700 dark:bg-slate-950"
              bodyClassName="text-sm font-medium flex gap-4 font-sans text-slate-600 dark:text-slate-50 rounded-xl"
            />
          </body>
        </ReactQueryProvider>
      </ClientSessionProvider>
    </html>
  )
}
