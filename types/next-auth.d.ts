import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      username?: string
      role?: string
      picture?: string
    } & DefaultSession["user"]
  }
  interface User extends DefaultUser {
    username?: string
    role?: string
    picture: string
  }
}
