"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkSyncStatus, fullSync, getDashboardData } from "../actions/server/Users";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const DashboardHome = () => {
  const { data: session } = useSession();
  const [syncStatus, setSyncStatus] = useState("checking"); // checking, syncing, completed, error
  const [dashboardData, setDashboardData] = useState(null);
  const [syncMessage, setSyncMessage] = useState("Checking your data...");

  const initializeDashboard = async () => {
    try {
      const githubId = session.user.githubId;
      const accessToken = session.accessToken;

      // Step 1: Check if sync is needed
      setSyncMessage("Checking your GitHub data...");
      const syncCheck = await checkSyncStatus(githubId);

      if (syncCheck.needsSync) {
        // Need to sync - show loading state
        setSyncStatus("syncing");
        setSyncMessage("Syncing your GitHub data...");

        // Perform full sync
        const syncResult = await fullSync(accessToken, githubId);
        
        if (!syncResult.success) {
          setSyncStatus("error");
          setSyncMessage(`Sync failed: ${syncResult.error}`);
          return;
        }

        setSyncMessage(`Synced ${syncResult.repoCount} repositories successfully!`);
      } else {
        // Data is fresh, just load it
        setSyncMessage("Loading your dashboard...");
      }

      // Load dashboard data
      const data = await getDashboardData(githubId);
      
      if (data.success) {
        setDashboardData(data);
        setSyncStatus("completed");
        setSyncMessage("");
      } else {
        setSyncStatus("error");
        setSyncMessage(`Failed to load data: ${data.error}`);
      }

    } catch (error) {
      console.error("Dashboard initialization error:", error);
      setSyncStatus("error");
      setSyncMessage("Something went wrong. Please try refreshing the page.");
    }
  };

  useEffect(() => {
    if (session?.user?.githubId && syncStatus === "checking") {
      initializeDashboard();
    }
  }, [session?.user?.githubId]);

  const handleResync = async () => {
    setSyncStatus("syncing");
    setSyncMessage("Re-syncing your GitHub data...");
    
    try {
      const githubId = session.user.githubId;
      const accessToken = session.accessToken;
      
      const syncResult = await fullSync(accessToken, githubId);
      
      if (syncResult.success) {
        const data = await getDashboardData(githubId);
        if (data.success) {
          setDashboardData(data);
          setSyncStatus("completed");
          setSyncMessage("");
        }
      } else {
        setSyncStatus("error");
        setSyncMessage(`Sync failed: ${syncResult.error}`);
      }
    } catch (error) {
      setSyncStatus("error");
      setSyncMessage("Sync failed. Please try again.");
    }
  };

  // Prepare chart data
  const getLanguageData = () => {
    if (!dashboardData?.repos) return [];
    
    const languageCounts = {};
    dashboardData.repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });
    
    return Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getStarsData = () => {
    if (!dashboardData?.repos) return [];
    
    return dashboardData.repos
      .filter(repo => repo.stargazersCount > 0)
      .sort((a, b) => b.stargazersCount - a.stargazersCount)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name,
        stars: repo.stargazersCount
      }));
  };

  const getCommitActivity = () => {
    if (!dashboardData?.commits) return [];
    
    const commitsByDate = {};
    dashboardData.commits.forEach(commit => {
      const date = new Date(commit.authorDate).toISOString().split('T')[0];
      commitsByDate[date] = (commitsByDate[date] || 0) + 1;
    });
    
    return Object.entries(commitsByDate)
      .map(([date, commits]) => ({ date, commits }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (syncStatus === "checking" || syncStatus === "syncing") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">{syncMessage}</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (syncStatus === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{syncMessage}</span>
          </div>
          <button 
            className="btn btn-primary mt-4"
            onClick={handleResync}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Dashboard loaded successfully
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Here is your GitHub activity overview</p>
        </div>
        <button 
          className="btn btn-primary text-white rounded-lg px-6 border-none"
          onClick={handleResync}
        >
          Refresh Data
        </button>
      </div>

      {dashboardData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Repositories</div>
              <div className="stat-value text-primary">{dashboardData.stats.totalRepos}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Commits</div>
              <div className="stat-value text-secondary">{dashboardData.stats.totalCommits}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Stars</div>
              <div className="stat-value text-accent">{dashboardData.stats.totalStars}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Languages</div>
              <div className="stat-value text-info">{dashboardData.stats.languages.length}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Skills</div>
              <div className="stat-value text-info">{dashboardData.stats.skills.length}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Language Distribution */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Language Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getLanguageData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ language, percent }) => `${language} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {getLanguageData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Repository Stars */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Most Starred Repositories</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getStarsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stars" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Commit Activity */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title">Commit Activity (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getCommitActivity()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Repositories */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Repositories</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Language</th>
                      <th>Stars</th>
                      <th>Forks</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.repos.slice(0, 10).map((repo) => (
                      <tr key={repo.repoId}>
                        <td>
                          <a 
                            href={repo.htmlUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="link link-primary font-medium"
                          >
                            {repo.name}
                          </a>
                          {repo.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {repo.description}
                            </div>
                          )}
                        </td>
                        <td>
                          {repo.language && (
                            <span className="badge badge-outline">{repo.language}</span>
                          )}
                        </td>
                        <td>
                          <span className="flex items-center gap-1">
                            ⭐ {repo.stargazersCount}
                          </span>
                        </td>
                        <td>
                          <span className="flex items-center gap-1">
                            🍴 {repo.forksCount}
                          </span>
                        </td>
                        <td>{new Date(repo.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;