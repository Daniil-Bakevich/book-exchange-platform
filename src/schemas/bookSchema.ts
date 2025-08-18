import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "The name must contain at least 1 character."),
  author: z.string().min(2, "The author's name must contain at least 2 characters."),
  description: z.string().min(10, "The description must contain at least 10 characters."),
  genreIds: z.array(z.number()).min(1, "Choose at least one genre."),
  images: z
    .array(
      z
        .string()
        .refine(val => val.startsWith("https://images.freeimages.com/"), {
          message: "The URL must start with https://images.freeimages.com/"
        })
        .url("Invalid image URL")
    )
    .min(1, "Add at least one image."),
  statusId: z.string().min(1, "Select the status")
});
