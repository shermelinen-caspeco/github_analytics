const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, AnalyticsEvent, Repository, User } = require('./models');
const githubService = require('./services/githubService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  console.log('API request received');
  res.json({ message: 'Hello from the backend!', database: 'Connected to PostgreSQL' });
});

// New API endpoints for analytics
app.post('/api/analytics/events', async (req, res) => {
  try {
    const { eventType, eventData, repository, userLogin } = req.body;
    
    const event = await AnalyticsEvent.create({
      eventType,
      eventData,
      repository,
      userLogin
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating analytics event:', error);
    res.status(500).json({ error: 'Failed to create analytics event' });
  }
});

app.get('/api/analytics/events', async (req, res) => {
  try {
    const { limit = 10, offset = 0, eventType, repository } = req.query;
    
    const whereClause = {};
    if (eventType) whereClause.eventType = eventType;
    if (repository) whereClause.repository = repository;
    
    const events = await AnalyticsEvent.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    const total = await AnalyticsEvent.count({ where: whereClause });
    
    res.json({
      events,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching analytics events:', error);
    res.status(500).json({ error: 'Failed to fetch analytics events' });
  }
});

// GitHub API endpoints
app.get('/api/github/organizations/:org/repositories', async (req, res) => {
  try {
    const { org } = req.params;
    const { sync = false } = req.query;
    
    console.log(`Fetching repositories for organization: ${org}`);
    
    // Fetch repositories from GitHub
    const githubRepos = await githubService.getOrganizationRepositories(org);
    
    // If sync is requested, save to database
    if (sync === 'true') {
      console.log('Syncing repositories to database...');
      
      for (const repoData of githubRepos) {
        await Repository.upsert({
          id: repoData.id,
          name: repoData.name,
          fullName: repoData.fullName,
          description: repoData.description,
          private: repoData.private,
          htmlUrl: repoData.htmlUrl,
          cloneUrl: repoData.cloneUrl,
          sshUrl: repoData.sshUrl,
          language: repoData.language,
          stargazersCount: repoData.stargazersCount,
          watchersCount: repoData.watchersCount,
          forksCount: repoData.forksCount,
          openIssuesCount: repoData.openIssuesCount,
          size: repoData.size,
          defaultBranch: repoData.defaultBranch,
          archived: repoData.archived,
          disabled: repoData.disabled,
          fork: repoData.fork,
          topics: repoData.topics,
          visibility: repoData.visibility,
          hasIssues: repoData.hasIssues,
          hasProjects: repoData.hasProjects,
          hasWiki: repoData.hasWiki,
          hasPages: repoData.hasPages,
          hasDiscussions: repoData.hasDiscussions,
          githubCreatedAt: repoData.createdAt,
          githubUpdatedAt: repoData.updatedAt,
          githubPushedAt: repoData.pushedAt
        });
      }
      
      console.log(`Synced ${githubRepos.length} repositories to database`);
    }
    
    res.json({
      organization: org,
      total: githubRepos.length,
      synced: sync === 'true',
      repositories: githubRepos
    });
    
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch GitHub repositories',
      message: error.message
    });
  }
});

app.get('/api/github/repositories', async (req, res) => {
  try {
    const { limit = 10, offset = 0, language, private: isPrivate, archived } = req.query;
    
    const whereClause = {};
    if (language) whereClause.language = language;
    if (isPrivate !== undefined) whereClause.private = isPrivate === 'true';
    if (archived !== undefined) whereClause.archived = archived === 'true';
    
    const repositories = await Repository.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['github_updated_at', 'DESC']]
    });
    
    const total = await Repository.count({ where: whereClause });
    
    res.json({
      repositories,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching repositories from database:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// GitHub users endpoints
app.get('/api/github/organizations/:org/members', async (req, res) => {
  try {
    const { org } = req.params;
    const { sync = false } = req.query;
    
    console.log(`Fetching members for organization: ${org}`);
    
    // Fetch members from GitHub
    const githubMembers = await githubService.getOrganizationMembers(org);
    
    // If sync is requested, save to database
    if (sync === 'true') {
      console.log('Syncing members to database...');
      
      for (const memberData of githubMembers) {
        await User.upsert({
          id: memberData.id,
          login: memberData.login,
          nodeId: memberData.nodeId,
          avatarUrl: memberData.avatarUrl,
          gravatarId: memberData.gravatarId,
          url: memberData.url,
          htmlUrl: memberData.htmlUrl,
          followersUrl: memberData.followersUrl,
          followingUrl: memberData.followingUrl,
          gistsUrl: memberData.gistsUrl,
          starredUrl: memberData.starredUrl,
          subscriptionsUrl: memberData.subscriptionsUrl,
          organizationsUrl: memberData.organizationsUrl,
          reposUrl: memberData.reposUrl,
          eventsUrl: memberData.eventsUrl,
          receivedEventsUrl: memberData.receivedEventsUrl,
          type: memberData.type,
          siteAdmin: memberData.siteAdmin
        });
      }
      
      console.log(`Synced ${githubMembers.length} members to database`);
    }
    
    res.json({
      organization: org,
      total: githubMembers.length,
      synced: sync === 'true',
      members: githubMembers
    });
    
  } catch (error) {
    console.error('Error fetching GitHub organization members:', error);
    res.status(500).json({ 
      error: 'Failed to fetch GitHub organization members',
      message: error.message
    });
  }
});

app.get('/api/github/users', async (req, res) => {
  try {
    const { limit = 10, offset = 0, type } = req.query;
    
    const whereClause = {};
    if (type) whereClause.type = type;
    
    const users = await User.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['login', 'ASC']]
    });
    
    const total = await User.count({ where: whereClause });
    
    res.json({
      users,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching users from database:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/github/rate-limits', async (req, res) => {
  try {
    const rateLimits = await githubService.getRateLimits();
    res.json(rateLimits);
  } catch (error) {
    console.error('Error fetching GitHub rate limits:', error);
    res.status(500).json({ 
      error: 'Failed to fetch rate limits',
      message: error.message
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();