"use server"

import { cache } from "react"
import { getServerSession } from "next-auth"

export const getCachedSession = cache(async () => {
  try {
    return await getServerSession()
  } catch (err) {
    return null
  }
})
