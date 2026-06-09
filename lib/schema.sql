-- 2HOL Town Hall Database Schema

-- Coords Table
CREATE TABLE IF NOT EXISTS coords (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'Normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Open',
  claimed_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- === Status Panel Tables ===

-- Town Status (resource levels). resource_name is UNIQUE because
-- updateResourceStatus() updates rows by name, so they must be pre-seeded.
CREATE TABLE IF NOT EXISTS town_status (
  id SERIAL PRIMARY KEY,
  resource_name VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'good', -- crisis | low | good | abundant
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- Infrastructure (key buildings). name is UNIQUE because
-- toggleInfrastructure() updates by id on pre-seeded rows.
CREATE TABLE IF NOT EXISTS infrastructure (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_operational BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issues (town problems to resolve)
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'medium', -- critical | high | medium | low
  status VARCHAR(20) DEFAULT 'open',     -- open | in_progress | resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects (active community builds)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',   -- active | completed | paused
  progress INTEGER DEFAULT 0,            -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wall of Fame donors (TikTok Live gifts, accumulated per viewer).
-- tiktok_user_id is UNIQUE NOT NULL so the webhook can upsert (ON CONFLICT)
-- and add new coins onto a donor's running total.
CREATE TABLE IF NOT EXISTS donors (
  id SERIAL PRIMARY KEY,
  tiktok_user_id VARCHAR(100) UNIQUE NOT NULL, -- stable TikTok id, or @handle fallback
  handle VARCHAR(100) NOT NULL,                -- @handle (uniqueId)
  username VARCHAR(150),                        -- display name / nickname
  total_coins INTEGER DEFAULT 0,
  honored_building TEXT,                        -- admin note: building in their honor
  last_donation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
