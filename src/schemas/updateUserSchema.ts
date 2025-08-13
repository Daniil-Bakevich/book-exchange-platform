import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "The name must contain at least 2 characters.").optional(),
  email: z.string().email("Invalid email").optional(),
  avatar: z
    .string()
    .refine(val => val.startsWith("https://i.pravatar.cc/"), {
      message: "The URL must start with https://i.pravatar.cc/"
    })
    .url("Invalid avatar URL")
    .optional()
});
