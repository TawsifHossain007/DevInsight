import GithubProvider from "next-auth/providers/github"
import { dbConnect, collections } from "./dbConnect"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          const usersCollection = await dbConnect(collections.USERS)
          
          const userData = {
            githubId: profile.id,
            username: profile.login,
            name: profile.name || profile.login,
            email: profile.email,
            avatarUrl: profile.avatar_url,
            githubAccessToken: account.access_token,
            developerScore: 0,
            isPublic: false,
            lastSyncedAt: new Date(),
          }

          await usersCollection.updateOne(
            { githubId: profile.id },
            { 
              $set: userData,
              $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
          )

          console.log('✅ User saved to database:', userData.username)
          return true
        } catch (error) {
          console.error("❌ Error saving user to database:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        try {
          const usersCollection = await dbConnect(collections.USERS)
          const user = await usersCollection.findOne({ githubId: parseInt(token.sub) })
          if (user) {
            session.user.id = user._id.toString()
            session.user.githubId = user.githubId
            session.user.username = user.username
            session.user.developerScore = user.developerScore
            session.user.avatarUrl = user.avatarUrl
          }
        } catch (error) {
          console.error("Error fetching user in session:", error)
        }
      }
      return session
    }
  }
}