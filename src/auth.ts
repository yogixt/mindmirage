import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { mindMirageDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

/* Auth.js — Google sign-in + name/nick & password accounts, JWT sessions,
   user records in Turso. No auth vendor: sessions are signed cookies. */

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      id: "credentials",
      name: "Name & password",
      credentials: {
        handle: { label: "Name or nick" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const handle = String(creds?.handle ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!handle || !password) return null;
        const db = mindMirageDb();
        if (!db) return null;
        try {
          const rs = await db.execute({
            sql: "SELECT id, name, email, password_hash FROM users WHERE handle = ? LIMIT 1",
            args: [handle],
          });
          if (!rs.rows.length) return null;
          const r = rs.rows[0];
          if (!r.password_hash || !verifyPassword(password, String(r.password_hash))) {
            return null;
          }
          return {
            id: String(r.id),
            name: r.name ? String(r.name) : handle,
            email: r.email ? String(r.email) : null,
          };
        } catch (e) {
          console.error("[auth] credentials authorize failed", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      // Upsert the sadhak record on every sign-in.
      try {
        const db = mindMirageDb();
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
    async jwt({ token, account, user }) {
      if (account?.provider === "google" && account.providerAccountId) {
        token.uid = `g_${account.providerAccountId}`;
      } else if (user && (user as { id?: string }).id) {
        // Credentials sign-in — id is the users.id from authorize().
        token.uid = (user as { id?: string }).id;
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
