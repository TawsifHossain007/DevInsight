import { LoginUser } from "@/actions/server/Auth";
import { collections, dbConnect } from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const user = await LoginUser({
          email: credentials.email,
          password: credentials.password,
        });
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const usersCollection = await dbConnect(collections.USERS);
        const isExist = await usersCollection.findOne({
          email: user.email,
        });

        if (isExist) {
          return true;
        }

        const newUser = {
          provider: account?.provider,
          email: user.email,
          name: user.name,
          Photo: user.image,
          role: "user",
        };
        const result = await usersCollection.insertOne(newUser);

        return result.acknowledged;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // If url is relative, prepend baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is on the same origin, return it
      if (new URL(url).origin === baseUrl) return url;
      // Otherwise return baseUrl for security
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token?.role;
        session.user.email = token?.email;
        session.user.image = token?.image;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          if (account?.provider === "google") {
            const usersCollection = await dbConnect(collections.USERS);
            const dbUser = await usersCollection.findOne({
              email: user.email,
            });
            token.role = dbUser?.role;
            token.email = dbUser?.email;
            token.image = dbUser?.Photo;
          } else {
            token.role = user?.role;
            token.email = user?.email;
            token.image = user?.Photo;
          }
        }
        return token;
      } catch (error) {
        console.error('Error in jwt callback:', error);
        return token;
      }
    },
  },
};