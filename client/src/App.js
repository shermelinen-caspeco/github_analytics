import React, { useState, useEffect } from 'react';
import './App.css';

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Caspeco GitHub Analytics</h1>
        <p>Organization Dashboard</p>
        
        {loading && <p>Loading data...</p>}
        {error && <p>Error: {error}</p>}
        
        {!loading && !error && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setActiveTab('repositories')}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  backgroundColor: activeTab === 'repositories' ? '#61dafb' : '#282c34',
                  color: activeTab === 'repositories' ? '#000' : '#fff',
                  border: '1px solid #61dafb',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Repositories ({repositories.length})
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeTab === 'users' ? '#61dafb' : '#282c34',
                  color: activeTab === 'users' ? '#000' : '#fff',
                  border: '1px solid #61dafb',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Members ({users.length})
              </button>
            </div>

            {activeTab === 'repositories' && (
              <div>
                <h2>Repositories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  {repositories.map(repo => (
                    <div key={repo.id} style={{ 
                      background: '#282c34', 
                      padding: '15px', 
                      borderRadius: '8px', 
                      border: '1px solid #61dafb',
                      textAlign: 'left'
                    }}>
                      <h3 style={{ color: '#61dafb', margin: '0 0 10px 0' }}>
                        <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb', textDecoration: 'none' }}>
                          {repo.name}
                        </a>
                      </h3>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{repo.description || 'No description'}</p>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', marginTop: '10px' }}>
                        <span>⭐ {repo.stargazersCount}</span>
                        <span>🍴 {repo.forksCount}</span>
                        <span>📝 {repo.language || 'N/A'}</span>
                        <span>{repo.private ? '🔒 Private' : '🌐 Public'}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                        Updated: {new Date(repo.githubUpdatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2>Organization Members</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  {users.map(user => (
                    <div key={user.id} style={{ 
                      background: '#282c34', 
                      padding: '15px', 
                      borderRadius: '8px', 
                      border: '1px solid #61dafb',
                      textAlign: 'center'
                    }}>
                      <img 
                        src={user.avatarUrl} 
                        alt={user.login}
                        style={{ 
                          width: '64px', 
                          height: '64px', 
                          borderRadius: '50%', 
                          marginBottom: '10px',
                          border: '2px solid #61dafb'
                        }}
                      />
                      <h3 style={{ color: '#61dafb', margin: '0 0 5px 0' }}>
                        <a href={user.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb', textDecoration: 'none' }}>
                          {user.login}
                        </a>
                      </h3>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        <span>{user.type}</span>
                        {user.siteAdmin && <span style={{ marginLeft: '10px', color: '#ff6b6b' }}>Site Admin</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
