import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projectService,
  type CreateProjectRequest,
  type ProjectStatus,
} from "@/services/projectService";

const PROJECT_STATUSES = {
  idea: { label: "Idea", color: "#A78BFA" },
  planning: { label: "Planning", color: "#60A5FA" },
  ongoing: { label: "Ongoing", color: "#10B981" },
  testing: { label: "Testing", color: "#FBBF24" },
  bug_fixes: { label: "Bug Fixes", color: "#F97316" },
  deployed: { label: "Deployed", color: "#14B8A6" },
  finished: { label: "Finished", color: "#059669" },
  archived: { label: "Archived", color: "#6B7280" },
  on_hold: { label: "On Hold", color: "#94A3B8" },
  refactoring: { label: "Refactoring", color: "#8B5CF6" },
} as const;

type TechStackItem = {
  tech_stack_item_id: string;
  name: string;
  color: string;
};

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  techStackItems: TechStackItem[];
};

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  techStackItems,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "idea" as ProjectStatus,
    techStackIds: [] as string[],
    githubUrl: "",
    liveUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: "idea",
      techStackIds: [],
      githubUrl: "",
      liveUrl: "",
    });
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const projectData: CreateProjectRequest = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        tech_stack_ids: formData.techStackIds,
        github_url: formData.githubUrl || undefined,
        live_url: formData.liveUrl || undefined,
      };

      await projectService.createProject(projectData);
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const toggleTechStack = (techId: string) => {
    if (formData.techStackIds.includes(techId)) {
      setFormData({
        ...formData,
        techStackIds: formData.techStackIds.filter((id) => id !== techId),
      });
    } else {
      setFormData({
        ...formData,
        techStackIds: [...formData.techStackIds, techId],
      });
    }
  };

  if (!isOpen) return null;

  const isValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.techStackIds.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2">
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g. MyLifeOS 2.0"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-2"
            />
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-medium mb-2">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as ProjectStatus })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_STATUSES).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tech Stack */}
          <div>
            <Label className="text-sm font-medium mb-3">
              Tech Stack * (Select at least one)
            </Label>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {techStackItems.map((tech) => {
                const isSelected = formData.techStackIds.includes(
                  tech.tech_stack_item_id,
                );
                return (
                  <button
                    key={tech.tech_stack_item_id}
                    onClick={() => toggleTechStack(tech.tech_stack_item_id)}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? tech.color : "transparent",
                      color: isSelected ? "#ffffff" : tech.color,
                      border: `2px solid ${tech.color}`,
                    }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GitHub URL */}
          <div>
            <Label htmlFor="githubUrl" className="text-sm font-medium mb-2">
              GitHub URL (Optional)
            </Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData({ ...formData, githubUrl: e.target.value })
              }
              className="mt-2"
            />
          </div>

          {/* Live URL */}
          <div>
            <Label htmlFor="liveUrl" className="text-sm font-medium mb-2">
              Live URL (Optional)
            </Label>
            <Input
              id="liveUrl"
              type="url"
              placeholder="https://yourproject.com"
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({ ...formData, liveUrl: e.target.value })
              }
              className="mt-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
