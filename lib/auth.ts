import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          isActive: user.isActive,
        } as any;
      }
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Ensure deactivated accounts cannot sign in (OAuth or credentials)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { isActive: true }
        });
        if (!dbUser?.isActive) {
          return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).isActive = token.isActive as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      // Always refresh role and isActive from DB to reflect deactivations
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, isActive: true }
          });
          if (dbUser) {
            token.role = dbUser.role as any;
            (token as any).isActive = dbUser.isActive;
          }
        } catch (e) {
          // If DB fails, keep existing token values
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/dashboard/auth/sign-in",
    error: "/dashboard/auth/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
