import type { NextAuthConfig } from "next-auth";

// This config must stay Edge-safe: no Prisma, no bcrypt, nothing that
// needs Node.js APIs. It's the part middleware.ts is allowed to import.
// The full config (providers, database adapter) lives in auth.ts and
// spreads this in — everywhere except middleware uses that one instead.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // real providers are added in auth.ts, not here
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "SEEKER" | "EMPLOYER" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;