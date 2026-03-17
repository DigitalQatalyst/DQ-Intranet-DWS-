-- Create podcast_series table
CREATE TABLE IF NOT EXISTS podcast_series (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  frequency TEXT, -- e.g., 'Weekly', 'Monthly'
  average_duration INTEGER, -- in minutes
  total_episodes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create podcast_episodes table
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id TEXT PRIMARY KEY,
  series_id TEXT NOT NULL REFERENCES podcast_series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT, -- Full markdown content including Focus and Intended Impact
  audio_url TEXT,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  byline TEXT,
  views INTEGER DEFAULT 0,
  reading_time TEXT, -- e.g., '<5', '5–10', '10–20', '20+'
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(series_id, episode_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_series_id ON podcast_episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_date ON podcast_episodes(date DESC);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_views ON podcast_episodes(views DESC);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_episode_number ON podcast_episodes(series_id, episode_number);

-- Enable Row Level Security
ALTER TABLE podcast_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to podcast_series"
  ON podcast_series FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to podcast_episodes"
  ON podcast_episodes FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated write access (for admin/content management)
CREATE POLICY "Allow authenticated insert to podcast_series"
  ON podcast_series FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to podcast_series"
  ON podcast_series FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete to podcast_series"
  ON podcast_series FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert to podcast_episodes"
  ON podcast_episodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to podcast_episodes"
  ON podcast_episodes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete to podcast_episodes"
  ON podcast_episodes FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_podcast_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_podcast_series_updated_at
  BEFORE UPDATE ON podcast_series
  FOR EACH ROW
  EXECUTE FUNCTION update_podcast_updated_at();

CREATE TRIGGER update_podcast_episodes_updated_at
  BEFORE UPDATE ON podcast_episodes
  FOR EACH ROW
  EXECUTE FUNCTION update_podcast_updated_at();

-- Insert Action-Solver Podcast series
INSERT INTO podcast_series (id, title, description, image_url, category, frequency, average_duration, total_episodes)
VALUES (
  'action-solver-podcast',
  'Action-Solver Podcast',
  'The Action-Solver Podcast delivers concise, actionable insights for busy professionals. Each episode tackles a specific challenge faced by DQ teams, providing practical frameworks and strategies you can implement immediately. Perfect for your commute, lunch break, or quick learning moment.',
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1600&q=80',
  'Action-Solver Series',
  'Weekly',
  13,
  10
);

-- Comment explaining the schema
COMMENT ON TABLE podcast_series IS 'Stores podcast series information including metadata and statistics';
COMMENT ON TABLE podcast_episodes IS 'Stores individual podcast episodes with content, audio URLs, and engagement metrics';
COMMENT ON COLUMN podcast_episodes.episode_number IS 'Sequential episode number within the series (e.g., 1 for EP1, 2 for EP2)';
COMMENT ON COLUMN podcast_episodes.content IS 'Full markdown content including sections like Focus of the Episode and Intended Impact';
COMMENT ON COLUMN podcast_episodes.reading_time IS 'Estimated listening duration in format: <5, 5–10, 10–20, or 20+ minutes';
