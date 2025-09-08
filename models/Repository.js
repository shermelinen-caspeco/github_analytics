const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repository = sequelize.define('Repository', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    comment: 'GitHub repository ID'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Repository name'
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name',
    comment: 'Full repository name (owner/repo)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Repository description'
  },
  private: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Is repository private'
  },
  htmlUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'html_url',
    comment: 'GitHub repository URL'
  },
  cloneUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'clone_url',
    comment: 'Repository clone URL'
  },
  sshUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'ssh_url',
    comment: 'Repository SSH URL'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Primary programming language'
  },
  stargazersCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'stargazers_count',
    comment: 'Number of stars'
  },
  watchersCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'watchers_count',
    comment: 'Number of watchers'
  },
  forksCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'forks_count',
    comment: 'Number of forks'
  },
  openIssuesCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'open_issues_count',
    comment: 'Number of open issues'
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Repository size in KB'
  },
  defaultBranch: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'main',
    field: 'default_branch',
    comment: 'Default branch name'
  },
  archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Is repository archived'
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Is repository disabled'
  },
  fork: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Is repository a fork'
  },
  topics: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Repository topics/tags'
  },
  visibility: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Repository visibility (public/private/internal)'
  },
  hasIssues: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'has_issues',
    comment: 'Has issues enabled'
  },
  hasProjects: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'has_projects',
    comment: 'Has projects enabled'
  },
  hasWiki: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'has_wiki',
    comment: 'Has wiki enabled'
  },
  hasPages: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_pages',
    comment: 'Has GitHub Pages enabled'
  },
  hasDiscussions: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'has_discussions',
    comment: 'Has discussions enabled'
  },
  githubCreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'github_created_at',
    comment: 'Repository creation date on GitHub'
  },
  githubUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'github_updated_at',
    comment: 'Repository last update date on GitHub'
  },
  githubPushedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'github_pushed_at',
    comment: 'Repository last push date on GitHub'
  }
}, {
  tableName: 'repositories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['full_name'],
      unique: true
    },
    {
      fields: ['language']
    },
    {
      fields: ['private']
    },
    {
      fields: ['archived']
    },
    {
      fields: ['fork']
    },
    {
      fields: ['github_updated_at']
    }
  ]
});

module.exports = Repository;