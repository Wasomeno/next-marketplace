import { createUploadthing, FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      return { test: "HEllo" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(metadata, file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
