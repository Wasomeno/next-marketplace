import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin"
      } else {
        return token?.email !== null && token?.email !== undefined
      }
    },
  },
})

export const config = {
  matcher: [
    "/cart",
    "/orders",
    "/wishlist",
    "/admin",
    "/admin/categories",
    "/admin/products",
    "/admin/orders",
  ],
}
