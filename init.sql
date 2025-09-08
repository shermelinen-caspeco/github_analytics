-- Initialize database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Example table for storing analytics data
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  repository VARCHAR(255),
  user_login VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_repository ON analytics_events(repository);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);