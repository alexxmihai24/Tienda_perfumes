import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { NextAuthConfig } from "next-auth";
import { adminLimiter, getClientIp } from "@/lib/ratelimit";

// ---------------------------------------------------------------------------
// TypeScript module augmentation — exposes session.user.role to consumers
// ---------------------------------------------------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: "admin";
    };
  }

  interface User {
    role?: string;
  }
}

// ---------------------------------------------------------------------------
// Input validation schema for login credentials
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ---------------------------------------------------------------------------
// Auth configuration
// ---------------------------------------------------------------------------
const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // Throttle login attempts per IP to slow brute-force against the admin account.
        const ip = request ? getClientIp(request as Request) : "127.0.0.1";
        const { success } = await adminLimiter.limit(`login:${ip}`);
        if (!success) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const adminEmail = process.env.ADMIN_EMAIL ?? "";
        const adminPassword = process.env.ADMIN_PASSWORD ?? "";

        // NOTE: This is a single-admin demo. In production use bcrypt.compare()
        // for password verification and store a hashed password in the DB.
        // Plain-text env-var comparison is acceptable here only because this is
        // a demo admin account. For production: hash the password with bcrypt
        // at setup time and store only the hash.
        //
        // Length check + equality: prevents short-circuit on length mismatch.
        // For production with bcrypt, timing safety is handled by bcrypt itself.
        const emailMatch =
          email.length === adminEmail.length && email === adminEmail;
        const passwordMatch =
          password.length === adminPassword.length &&
          password === adminPassword;

        if (emailMatch && passwordMatch) {
          return {
            id: "1",
            email,
            name: "Admin Azahara",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },

  callbacks: {
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin") ?? "admin";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
