import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { loginSchema } from "./schemas/loginSchema";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      try {
        const { email, password } = await loginSchema.parseAsync(credentials);

        const res = await fetch(`http://localhost:3001/users?email=${email}`);
        const users = await res.json();
        const user = users[0];

        if (!user || !user.hashedPassword) {
          console.error(`User with email ${email} doesn't exist`);
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (isPasswordCorrect) {
          delete user.hashedPassword;
          return user;
        } else {
          return null;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error:", z.flattenError(error).fieldErrors);
        }

        return null;
      }
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
