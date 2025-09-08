const sequelize = require('../config/database');
const AnalyticsEvent = require('./AnalyticsEvent');
const Repository = require('./Repository');
const User = require('./User');

const models = {
  AnalyticsEvent,
  Repository,
  User
};

// Define associations here if needed
// e.g., AnalyticsEvent.hasMany(OtherModel);

module.exports = {
  sequelize,
  ...models
};