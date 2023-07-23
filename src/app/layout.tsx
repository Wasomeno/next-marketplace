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
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              draggable
              theme="light"
            />
          </body>
        </ReactQueryProvider>
      </ClientSessionProvider>
    </html>
  );
}
