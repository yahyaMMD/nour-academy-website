import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string; // Add role to the session user
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // Define role in the User object
  }
}
