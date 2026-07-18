import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";

// Google Cloud ConsoleでのOAuthクライアント作成が未了の環境（ローカル開発初期など）でも
// Credentialsログインだけは動作するよう、環境変数が揃っている時だけGoogleプロバイダーを有効にする。
const providers: Provider[] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Credentials（メール/パスワード）プロバイダーを使うため、セッションはjwt戦略が必須
  // （Auth.jsの仕様上、Credentialsログインのユーザーはdatabaseセッションを持てない）。
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...providers,
    Credentials({
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password =
          typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt.toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // OAuth（Google）はアダプター経由のUser行がそのまま渡るのでcreatedAtを持つが、
        // Credentialsのauthorize()は明示的に返した値しか渡らないため、両方に対応する。
        const createdAt =
          "createdAt" in user && user.createdAt
            ? user.createdAt
            : await prisma.user.findUnique({ where: { id: user.id } }).then((u) => u?.createdAt);
        if (createdAt) {
          token.createdAt =
            createdAt instanceof Date ? createdAt.toISOString() : (createdAt as string);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      if (session.user && token.createdAt) {
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
  },
});
