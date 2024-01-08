import NextAuth from 'next-auth';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/',
  },
};

export default NextAuth(authOptions);
