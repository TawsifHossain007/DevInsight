'use server'

import { dbConnect, collections } from "@/lib/dbConnect"

/**
 * Sync user data from GitHub API
 * @param {string} githubAccessToken - User's GitHub access token
 * @param {number} githubId - User's GitHub ID
 */
export async function syncGitHubUserData(githubAccessToken, githubId) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data')
    }

    const githubData = await response.json()
    
    const usersCollection = await dbConnect(collections.USERS)

    const updateData = {
      username: githubData.login,
      name: githubData.name || githubData.login,
      email: githubData.email,
      avatarUrl: githubData.avatar_url,
      lastSyncedAt: new Date()
    }

    await usersCollection.updateOne(
      { githubId },
      { $set: updateData }
    )

    return { success: true, data: updateData }
  } catch (error) {
    console.error('Error syncing GitHub data:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user by GitHub ID
 */
export async function getUserByGithubId(githubId) {
  try {
    const usersCollection = await dbConnect(collections.USERS)
    const user = await usersCollection.findOne({ githubId })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
