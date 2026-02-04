import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/services/projectService";

type TechStackItem = {
  tech_stack_item_id: string;
  name: string;
  color: string;
};

type ProjectPhase = {
  phase_id: string;
  title: string;
  tasks: string;
  status: string;
};

type ProjectTask = {
  task_id: string;
  title: string;
  completed: boolean;
};

type ProjectCardProps = {
  project: Project;
  techStackItems: TechStackItem[];
  phases: ProjectPhase[];
  tasks: ProjectTask[];
  statusConfig: {
    label: string;
    color: string;
    icon: React.ComponentType<{ size?: number }>;
  };
  onClick: () => void;
};

export function ProjectCard({
  project,
  techStackItems,
  phases,
  tasks,
  statusConfig,
  onClick,
}: ProjectCardProps) {
  const getTechStack = (ids: string[]) => {
    return techStackItems
      .filter((tech) => ids.includes(tech.tech_stack_item_id))
      .sort(
        (a, b) =>
          ids.indexOf(a.tech_stack_item_id) - ids.indexOf(b.tech_stack_item_id),
      );
  };

  const techStack = getTechStack(project.tech_stack_ids);
  const StatusIcon = statusConfig.icon;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const lastUpdated = new Date(project.updated_at).toLocaleDateString();

  return (
    <Card
      className="hover:bg-muted/50 transition-colors cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <CardContent className="flex-1 flex flex-col gap-4 p-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          <Badge
            variant="outline"
            className="gap-1.5"
            style={{
              borderColor: statusConfig.color,
              color: statusConfig.color,
            }}
          >
            <StatusIcon size={14} />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Tech Stack */}
        <div className="flex items-center gap-2 flex-wrap">
          {techStack.map((tech) => (
            <Badge
              key={tech.tech_stack_item_id}
              variant="outline"
              style={{
                borderColor: tech.color,
                color: tech.color,
              }}
            >
              {tech.name}
            </Badge>
          ))}
        </div>

        {/* Phases OR Tasks */}
        {phases.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Phases:</p>
            <div className="space-y-1">
              {phases.slice(0, 3).map((phase) => (
                <div
                  key={phase.phase_id}
                  className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <span className="text-muted-foreground">{phase.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {phase.tasks}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {phase.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tasks:</p>
            <div className="space-y-1">
              {tasks
                .filter((t) => !t.completed)
                .slice(0, 3)
                .map((task) => (
                  <div
                    key={task.task_id}
                    className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <span className="text-muted-foreground">☐</span>
                    <span className="text-muted-foreground flex-1">
                      {task.title}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
            <span>{phases.length} phases</span>
            <span>{lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
