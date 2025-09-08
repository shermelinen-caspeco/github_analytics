import React, { useState, useEffect } from 'react';
import './App.css';

// Grafana-style icon components
const GitHubIcon = () => (
  <svg className="grafana-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
  </svg>
);

const RepositoryIcon = () => (
  <svg className="grafana-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6,2A3,3 0 0,1 9,5C9,6.28 8.19,7.38 7.06,7.81C7.15,8.27 7.39,8.83 8,9.63C9,10.92 11,12.83 12,14V19A3,3 0 0,1 9,22H9A3,3 0 0,1 6,19V13.5L4.5,15C4.09,15.41 3.46,15.41 3.04,15C2.63,14.59 2.63,13.95 3.04,13.54L6,10.5C6.41,10.09 7.04,10.09 7.46,10.5C7.87,10.91 7.87,11.55 7.46,11.96L6,13.41V19A1,1 0 0,0 7,20H9A1,1 0 0,0 10,19V14C10,13.62 10.09,13.27 10.24,12.96L7.06,7.81C6.92,7.5 6.82,7.15 6.82,6.78C7.61,6.5 8.21,5.73 8.21,4.82C8.21,3.65 7.35,2.68 6.21,2.68C5.85,2.68 5.53,2.8 5.29,3C5.06,3.2 4.94,3.5 4.94,3.82C4.94,4.73 5.54,5.5 6.33,5.78C6.33,6.15 6.23,6.5 6.09,6.81C5.61,6.38 5,5.78 5,5C5,3.34 6.34,2 8,2H6M9,5A1,1 0 0,0 8,4A1,1 0 0,0 7,5A1,1 0 0,0 8,6A1,1 0 0,0 9,5Z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="grafana-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 22,15.33 22,18V20H10V18C10,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 14,15.33 14,18V20H2V18C2,15.33 5.33,14 8,14Z" />
  </svg>
);

function App() {
  const [repositories, setRepositories] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('repositories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Making API calls to fetch data');
        
        const [reposResponse, usersResponse] = await Promise.all([
          fetch('/api/github/repositories'),
          fetch('/api/github/users?limit=100')
        ]);

        const reposData = await reposResponse.json();
        const usersData = await usersResponse.json();

        console.log('Repository data:', reposData);
        console.log('Users data:', usersData);
        
        setRepositories(reposData.repositories);
        setUsers(usersData.users);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = () => {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forksCount, 0);
    const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))];
    const privateRepos = repositories.filter(repo => repo.private).length;

    return { totalStars, totalForks, languages: languages.length, privateRepos };
  };

  const stats = repositories.length > 0 ? calculateStats() : { totalStars: 0, totalForks: 0, languages: 0, privateRepos: 0 };

  return (
    <div className="grafana-app">
      <header className="grafana-header">
        <h1>
          <GitHubIcon />
          Caspeco GitHub Analytics
        </h1>
      </header>

      <main className="grafana-main">
        <div className="grafana-dashboard-header">
          <h2 className="grafana-dashboard-title">Organization Dashboard</h2>
          <div className="grafana-dashboard-controls">
            <div className="grafana-tab-container">
              <button 
                className={`grafana-tab ${activeTab === 'repositories' ? 'active' : ''}`}
                onClick={() => setActiveTab('repositories')}
              >
                <RepositoryIcon />
                Repositories
                <span className="grafana-tab-badge">{repositories.length}</span>
              </button>
              <button 
                className={`grafana-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <UsersIcon />
                Members
                <span className="grafana-tab-badge">{users.length}</span>
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="grafana-loading">
            <p>Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="grafana-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics Overview */}
            <div className="grafana-stats-row">
              <div className="grafana-stats-panel">
                <div className="grafana-stats-value">{repositories.length}</div>
                <div className="grafana-stats-label">Total Repositories</div>
              </div>
              <div className="grafana-stats-panel">
                <div className="grafana-stats-value">{stats.totalStars}</div>
                <div className="grafana-stats-label">Total Stars</div>
              </div>
              <div className="grafana-stats-panel">
                <div className="grafana-stats-value">{stats.totalForks}</div>
                <div className="grafana-stats-label">Total Forks</div>
              </div>
              <div className="grafana-stats-panel">
                <div className="grafana-stats-value">{users.length}</div>
                <div className="grafana-stats-label">Team Members</div>
              </div>
            </div>

            {activeTab === 'repositories' && (
              <div className="grafana-dashboard-content">
                {repositories.map(repo => (
                  <div key={repo.id} className="grafana-panel">
                    <div className="grafana-panel-header">
                      <h3 className="grafana-panel-title">
                        <RepositoryIcon />
                        <a 
                          href={repo.htmlUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="grafana-repo-link"
                        >
                          {repo.name}
                        </a>
                        <span className={`grafana-status-badge ${repo.private ? 'grafana-status-private' : 'grafana-status-public'}`}>
                          {repo.private ? 'Private' : 'Public'}
                        </span>
                      </h3>
                    </div>
                    <div className="grafana-panel-content">
                      <p className="grafana-repo-description">
                        {repo.description || 'No description available'}
                      </p>
                      <div className="grafana-metric-grid">
                        <div className="grafana-metric">
                          <div className="grafana-metric-value">{repo.stargazersCount}</div>
                          <div className="grafana-metric-label">Stars</div>
                        </div>
                        <div className="grafana-metric">
                          <div className="grafana-metric-value">{repo.forksCount}</div>
                          <div className="grafana-metric-label">Forks</div>
                        </div>
                        <div className="grafana-metric">
                          <div className="grafana-metric-value">{repo.openIssuesCount}</div>
                          <div className="grafana-metric-label">Issues</div>
                        </div>
                        <div className="grafana-metric">
                          <div className="grafana-metric-value">{repo.language || 'N/A'}</div>
                          <div className="grafana-metric-label">Language</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--grafana-text-muted)' }}>
                        Updated: {new Date(repo.githubUpdatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="grafana-dashboard-content">
                {users.map(user => (
                  <div key={user.id} className="grafana-panel">
                    <div className="grafana-panel-header">
                      <h3 className="grafana-panel-title">
                        <UsersIcon />
                        Team Member
                      </h3>
                    </div>
                    <div className="grafana-panel-content">
                      <div className="grafana-user-panel">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.login}
                          className="grafana-user-avatar"
                        />
                        <div className="grafana-user-name">
                          <a 
                            href={user.htmlUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="grafana-repo-link"
                          >
                            {user.login}
                          </a>
                        </div>
                        <div className={`grafana-user-type ${user.siteAdmin ? 'grafana-user-admin' : ''}`}>
                          {user.type}
                          {user.siteAdmin && ' • Site Admin'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
