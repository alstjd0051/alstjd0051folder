import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import RedditProvider from "next-auth/providers/reddit";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
