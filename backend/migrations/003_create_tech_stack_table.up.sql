CREATE TABLE IF NOT EXISTS tech_stack_items (
    tech_stack_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name)
);