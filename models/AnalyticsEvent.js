const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnalyticsEvent = sequelize.define('AnalyticsEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'event_type'
  },
  eventData: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'event_data'
  },
  repository: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userLogin: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'user_login'
  }
}, {
  tableName: 'analytics_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AnalyticsEvent;