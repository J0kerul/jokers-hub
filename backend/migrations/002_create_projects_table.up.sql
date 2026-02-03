CREATE TYPE project_status_enum AS ENUM ('idea', 'planning', 'ongoing', 'testing', 'bug_fixes', 'deployed', 'finished', 'archived', 'on_hold', 'refactoring');

CREATE TABLE IF NOT EXISTS projects (
    project_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status project_status_enum NOT NULL,
    github_url TEXT,
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)