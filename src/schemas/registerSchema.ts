import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "The name must contain at least 2 characters."),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
  });
