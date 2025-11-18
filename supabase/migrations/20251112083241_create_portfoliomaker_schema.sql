/*
  # PortfolioMaker Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text, either 'student' or 'recruiter')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `portfolios`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `username` (text, unique, for URL slug)
      - `tagline` (text)
      - `bio` (text)
      - `phone` (text)
      - `location` (text)
      - `website` (text)
      - `github` (text)
      - `linkedin` (text)
      - `theme` (text, default 'modern')
      - `is_public` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `education`
      - `id` (uuid, primary key)
      - `portfolio_id` (uuid, references portfolios)
      - `institution` (text)
      - `degree` (text)
      - `field` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `experience`
      - `id` (uuid, primary key)
      - `portfolio_id` (uuid, references portfolios)
      - `company` (text)
      - `position` (text)
      - `location` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `portfolio_id` (uuid, references portfolios)
      - `title` (text)
      - `description` (text)
      - `technologies` (text[])
      - `link` (text)
      - `github_link` (text)
      - `created_at` (timestamptz)
    
    - `skills`
      - `id` (uuid, primary key)
      - `portfolio_id` (uuid, references portfolios)
      - `name` (text)
      - `category` (text)
      - `proficiency` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Profiles: Users can read all profiles but only update their own
    - Portfolios: Public portfolios are readable by everyone, users can only modify their own
    - Education, Experience, Projects, Skills: Readable by everyone, modifiable only by portfolio owner
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'recruiter')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  tagline text DEFAULT '',
  bio text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  website text DEFAULT '',
  github text DEFAULT '',
  linkedin text DEFAULT '',
  theme text DEFAULT 'modern' CHECK (theme IN ('modern', 'minimal', 'professional')),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  start_date text DEFAULT '',
  end_date text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  location text DEFAULT '',
  start_date text DEFAULT '',
  end_date text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  technologies text[] DEFAULT '{}',
  link text DEFAULT '',
  github_link text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT 'Other',
  proficiency text DEFAULT 'Intermediate',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public portfolios"
  ON portfolios FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own portfolio"
  ON portfolios FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio"
  ON portfolios FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view education for public portfolios"
  ON education FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = education.portfolio_id
      AND portfolios.is_public = true
    )
  );

CREATE POLICY "Portfolio owners can insert education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = education.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can update education"
  ON education FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = education.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = education.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can delete education"
  ON education FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = education.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view experience for public portfolios"
  ON experience FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = experience.portfolio_id
      AND portfolios.is_public = true
    )
  );

CREATE POLICY "Portfolio owners can insert experience"
  ON experience FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = experience.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can update experience"
  ON experience FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = experience.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = experience.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can delete experience"
  ON experience FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = experience.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view projects for public portfolios"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = projects.portfolio_id
      AND portfolios.is_public = true
    )
  );

CREATE POLICY "Portfolio owners can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = projects.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = projects.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = projects.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = projects.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view skills for public portfolios"
  ON skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = skills.portfolio_id
      AND portfolios.is_public = true
    )
  );

CREATE POLICY "Portfolio owners can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = skills.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = skills.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = skills.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = skills.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_portfolios_username ON portfolios(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_experience_portfolio_id ON experience(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_skills_portfolio_id ON skills(portfolio_id);