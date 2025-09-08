const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    comment: 'GitHub user ID'
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'GitHub username'
  },
  nodeId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'node_id',
    comment: 'GitHub node ID'
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'avatar_url',
    comment: 'User avatar URL'
  },
  gravatarId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'gravatar_id',
    comment: 'Gravatar ID'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'GitHub API URL'
  },
  htmlUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'html_url',
    comment: 'GitHub profile URL'
  },
  followersUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'followers_url',
    comment: 'Followers API URL'
  },
  followingUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'following_url',
    comment: 'Following API URL'
  },
  gistsUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'gists_url',
    comment: 'Gists API URL'
  },
  starredUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'starred_url',
    comment: 'Starred repositories API URL'
  },
  subscriptionsUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'subscriptions_url',
    comment: 'Subscriptions API URL'
  },
  organizationsUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'organizations_url',
    comment: 'Organizations API URL'
  },
  reposUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'repos_url',
    comment: 'Repositories API URL'
  },
  eventsUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'events_url',
    comment: 'Events API URL'
  },
  receivedEventsUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'received_events_url',
    comment: 'Received events API URL'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'User type (User, Organization, etc.)'
  },
  siteAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'site_admin',
    comment: 'Is site admin'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['login'],
      unique: true
    },
    {
      fields: ['type']
    }
  ]
});

module.exports = User;