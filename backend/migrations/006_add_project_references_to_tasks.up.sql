ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_project 
FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL;

ALTER TABLE tasks
ADD COLUMN phase_id UUID REFERENCES phases(phase_id) ON DELETE SET NULL;