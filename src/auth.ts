import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { journalDb } from "@/lib/journal";

/* Auth.js — Google sign-in, JWT sessions, user records in Turso.
   No auth vendor: sessions are signed cookies (AUTH_SECRET). */

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    async signIn({ user, account }) {
      // Upsert the sadhak record on every sign-in.
      try {
        const db = journalDb();
        if (db && account?.providerAccountId) {
          const id = `g_${account.providerAccountId}`;
          await db.execute({
            sql: `INSERT INTO users (id, email, name, image)
                  VALUES (?, ?, ?, ?)
                  ON CONFLICT (id) DO UPDATE SET
                    email = excluded.email,
                    name = COALESCE(excluded.name, users.name),
                    image = COALESCE(excluded.image, users.image)`,
            args: [id, user.email ?? "", user.name ?? null, user.image ?? null],
          });
        }
      } catch (e) {
        console.error("[auth] user upsert failed", e);
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.uid = `g_${account.providerAccountId}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.uid) {
        (session.user as { id?: string }).id = String(token.uid);
      }
      return session;
    },
  },
});
