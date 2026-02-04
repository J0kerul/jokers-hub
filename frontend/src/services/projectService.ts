const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export type ProjectStatus = 
  | 'idea' 
  | 'planning' 
  | 'ongoing' 
  | 'testing' 
  | 'bug_fixes' 
  | 'deployed' 
  | 'finished' 
  | 'archived' 
  | 'on_hold' 
  | 'refactoring';

export type Project = {
  project_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tech_stack_ids: string[];
  github_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
};

export type CreateProjectRequest = {
  title: string;
  description: string;
  status: ProjectStatus;
  tech_stack_ids: string[];
  github_url?: string;
  live_url?: string;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

class ProjectService {
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create project');
    }

    return response.json();
  }

  async updateProject(id: string, project: UpdateProjectRequest): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update project');
    }

    return response.json();
  }

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();