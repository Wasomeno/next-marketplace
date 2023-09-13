import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      id: "credentials",
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: { label: "password", type: "password" },
      },
      // @ts-expect-error
      async authorize(credentials) {
        try {
          let userDetails
          userDetails = await prisma.admin.findUnique({
            where: { username: credentials?.username },
          })
          if (!credentials?.username || !credentials.password) {
            const error = new Error("password or username can't be empty")
            throw error
          } else if (userDetails?.password !== credentials.password) {
            throw new Error("password don't match")
          } else {
            return {
              ...userDetails,
              role: "admin",
            }
          }
        } catch (error) {
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user = { ...token }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
