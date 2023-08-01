import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import ClientSessionProvider from "@/components/session-provider";
import ToastifyContainer from "@/components/toastify-client-container";
import { ReactQueryProvider } from "@/lib/react-query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientSessionProvider>
        <ReactQueryProvider>
          <body className="bg-slate-50 antialiased">
            {children}
            <ToastifyContainer
              closeButton={false}
              position="bottom-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              rtl={false}
              toastClassName="bg-white  border border-slate-300 rounded-lg"
              bodyClassName="text-sm font-medium flex gap-4 font-sans text-slate-600"
            />
          </body>
        </ReactQueryProvider>
      </ClientSessionProvider>
    </html>
  );
}
