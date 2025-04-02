import { createRouteHandler } from "uploadthing/next"

/** app/api/uploadthing/route.ts */
import { ourFileRouter } from "./core"

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
