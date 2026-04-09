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

/**
 * Check if user needs to sync (no repos or stale data)
 */
export async function checkSyncStatus(githubId) {
  try {
    const reposCollection = await dbConnect(collections.REPOSITORIES)
    const usersCollection = await dbConnect(collections.USERS)
    
    const user = await usersCollection.findOne({ githubId })
    const repoCount = await reposCollection.countDocuments({ userId: githubId })
    
    if (repoCount === 0) {
      return { needsSync: true, reason: 'no_data' }
    }
    
    const lastSynced = user?.lastSyncedAt
    if (!lastSynced) {
      return { needsSync: true, reason: 'no_sync_date' }
    }
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const isStale = new Date(lastSynced) < oneHourAgo
    
    return { 
      needsSync: isStale, 
      reason: isStale ? 'stale_data' : 'fresh',
      lastSynced 
    }
  } catch (error) {
    console.error('Error checking sync status:', error)
    return { needsSync: true, reason: 'error' }
  }
}

/**
 * Sync repositories from GitHub
 */
export async function syncRepositories(githubAccessToken, githubId) {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories')
    }

    const repos = await response.json()
    const reposCollection = await dbConnect(collections.REPOSITORIES)
    
    const repoData = repos.map(repo => ({
      userId: githubId,
      repoId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      isPrivate: repo.private,
      isFork: repo.fork,
      createdAt: new Date(repo.created_at),
      updatedAt: new Date(repo.updated_at),
      pushedAt: new Date(repo.pushed_at),
      size: repo.size,
      defaultBranch: repo.default_branch,
      htmlUrl: repo.html_url,
      syncedAt: new Date()
    }))

    // Delete old repos and insert new ones
    await reposCollection.deleteMany({ userId: githubId })
    if (repoData.length > 0) {
      await reposCollection.insertMany(repoData)
    }

    return { success: true, count: repoData.length }
  } catch (error) {
    console.error('Error syncing repositories:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sync commits for a specific repository
 */
export async function syncCommits(githubAccessToken, githubId, repoFullName) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch commits for ${repoFullName}`)
    }

    const commits = await response.json()
    const commitsCollection = await dbConnect(collections.COMMITS)
    
    const commitData = commits.map(commit => ({
      userId: githubId,
      repoFullName,
      sha: commit.sha,
      message: commit.commit.message,
      authorName: commit.commit.author.name,
      authorEmail: commit.commit.author.email,
      authorDate: new Date(commit.commit.author.date),
      committerName: commit.commit.committer.name,
      committerDate: new Date(commit.commit.committer.date),
      htmlUrl: commit.html_url,
      syncedAt: new Date()
    }))

    // Delete old commits for this repo and insert new ones
    await commitsCollection.deleteMany({ userId: githubId, repoFullName })
    if (commitData.length > 0) {
      await commitsCollection.insertMany(commitData)
    }

    return { success: true, count: commitData.length }
  } catch (error) {
    console.error(`Error syncing commits for ${repoFullName}:`, error)
    return { success: false, error: error.message }
  }
}

/**
 * Full sync: repos + commits for all repos
 */
export async function fullSync(githubAccessToken, githubId) {
  try {
    // Sync repositories first
    const repoResult = await syncRepositories(githubAccessToken, githubId)
    if (!repoResult.success) {
      return { success: false, error: 'Failed to sync repositories' }
    }

    // Get all repos to sync commits
    const reposCollection = await dbConnect(collections.REPOSITORIES)
    const repos = await reposCollection.find({ userId: githubId }).toArray()
    
    // Sync commits for each repo (limit to first 10 to avoid timeout)
    const commitPromises = repos.slice(0, 10).map(repo => 
      syncCommits(githubAccessToken, githubId, repo.fullName)
    )
    
    await Promise.all(commitPromises)

    // Update user's lastSyncedAt
    const usersCollection = await dbConnect(collections.USERS)
    await usersCollection.updateOne(
      { githubId },
      { $set: { lastSyncedAt: new Date() } }
    )

    return { 
      success: true, 
      repoCount: repoResult.count,
      message: 'Sync completed successfully'
    }
  } catch (error) {
    console.error('Error in full sync:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get dashboard data from MongoDB
 */
export async function getDashboardData(githubId) {
  try {
    const reposCollection = await dbConnect(collections.REPOSITORIES)
    const commitsCollection = await dbConnect(collections.COMMITS)
    
    const repos = await reposCollection.find({ userId: githubId }).toArray()
    const commits = await commitsCollection.find({ userId: githubId }).toArray()
    
    return {
      success: true,
      repos: JSON.parse(JSON.stringify(repos)),
      commits: JSON.parse(JSON.stringify(commits)),
      stats: {
        totalRepos: repos.length,
        totalCommits: commits.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazersCount, 0),
        languages: [...new Set(repos.map(r => r.language).filter(Boolean))]
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return { success: false, error: error.message }
  }
}
