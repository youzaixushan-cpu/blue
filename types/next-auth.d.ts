import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      createdAt?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    createdAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    createdAt?: string;
  }
}
