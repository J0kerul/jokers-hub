import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Github,
  ExternalLink,
  Plus,
  Menu,
  X,
  Lightbulb,
  ClipboardList,
  Code2,
  FlaskConical,
  Bug,
  Rocket,
  CheckCircle,
  Archive,
  Pause,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

// Project Status Configuration
const PROJECT_STATUSES = {
  idea: { label: "Idea", color: "#A78BFA", icon: Lightbulb },
  planning: { label: "Planning", color: "#60A5FA", icon: ClipboardList },
  ongoing: { label: "Ongoing", color: "#10B981", icon: Code2 },
  testing: { label: "Testing", color: "#FBBF24", icon: FlaskConical },
  bugfixes: { label: "Bug Fixes", color: "#F97316", icon: Bug },
  deployed: { label: "Deployed", color: "#14B8A6", icon: Rocket },
  finished: { label: "Finished", color: "#059669", icon: CheckCircle },
  archived: { label: "Archived", color: "#6B7280", icon: Archive },
  onhold: { label: "On Hold", color: "#94A3B8", icon: Pause },
  refactoring: { label: "Refactoring", color: "#8B5CF6", icon: RefreshCw },
} as const;

type ProjectStatus = keyof typeof PROJECT_STATUSES;

// Task type for projects
type ProjectTask = {
  task_id: string;
  title: string;
  completed: boolean;
};

// Phase type with tasks
type ProjectPhase = {
  phase_id: string;
  title: string;
  description?: string;
  status: string;
  tasks: string;
  phaseItems?: ProjectTask[];
};

// Tech Stack Items Configuration
type TechStackItem = {
  id: string;
  name: string;
  color: string;
  position: number;
};

const TECH_STACK_ITEMS: TechStackItem[] = [
  // Frontend
  { id: "1", name: "React", color: "#61DAFB", position: 1 },
  { id: "2", name: "TypeScript", color: "#3178C6", position: 2 },
  { id: "3", name: "Next.js", color: "#000000", position: 3 },
  { id: "4", name: "Tailwind CSS", color: "#06B6D4", position: 4 },
  { id: "5", name: "Vite", color: "#646CFF", position: 5 },

  // Backend
  { id: "6", name: "Go", color: "#00ADD8", position: 6 },
  { id: "7", name: "Node.js", color: "#339933", position: 7 },
  { id: "8", name: "Python", color: "#3776AB", position: 8 },

  // Database
  { id: "9", name: "PostgreSQL", color: "#4169E1", position: 9 },
  { id: "10", name: "MongoDB", color: "#47A248", position: 10 },
  { id: "11", name: "Redis", color: "#DC382D", position: 11 },

  // DevOps
  { id: "12", name: "Docker", color: "#2496ED", position: 12 },
  { id: "13", name: "Kubernetes", color: "#326CE5", position: 13 },
  { id: "14", name: "GitHub Actions", color: "#2088FF", position: 14 },
].sort((a, b) => a.position - b.position);

export default function ProjectManager() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showPhaseEditModal, setShowPhaseEditModal] = useState(false);
  const [showTaskChoiceModal, setShowTaskChoiceModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [selectedPhase, setSelectedPhase] = useState<
    (typeof projects)[0]["phases"][0] | null
  >(null);

  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "idea" as ProjectStatus,
    techStackIds: [] as string[],
    githubUrl: "",
    liveUrl: "",
  });

  // Form state for phase edit
  const [phaseForm, setPhaseForm] = useState({
    title: "",
    description: "",
    status: "idea" as ProjectStatus,
  });
  // Mock Projects - direkt hardcoded
  const projects = [
    {
      project_id: "1",
      title: "MyLifeOS 2.0",
      description:
        "Full-stack personal life management system with modular architecture. Features task management, dashboard widgets, and clean architecture patterns.",
      status: "ongoing" as ProjectStatus,
      githubUrl: "https://github.com/alex/mylifeos",
      liveUrl: "https://mylifeos.onrender.com",
      techStackIds: ["6", "1", "2", "9", "12", "4"], // Go, React, TypeScript, PostgreSQL, Docker, Tailwind CSS
      phases: [
        {
          phase_id: "phase1",
          title: "Setup & Architecture",
          description:
            "Initial project setup with Docker, database design, and architecture decisions. Setting up both Go backend and React frontend with all necessary tooling.",
          status: "finished",
          tasks: "5/5",
          phaseItems: [
            {
              task_id: "p1t1",
              title: "Setup Docker environment",
              completed: true,
            },
            {
              task_id: "p1t2",
              title: "Design database schema",
              completed: true,
            },
            {
              task_id: "p1t3",
              title: "Setup Go project structure",
              completed: true,
            },
            {
              task_id: "p1t4",
              title: "Setup React with Vite",
              completed: true,
            },
            {
              task_id: "p1t5",
              title: "Configure Tailwind CSS",
              completed: true,
            },
          ],
        },
        {
          phase_id: "phase2",
          title: "Core Features",
          description:
            "Implementing the core functionality of the application including Task management, Dashboard with widgets, and now building the Project Manager module with tech stack filtering.",
          status: "ongoing",
          tasks: "3/8",
          phaseItems: [
            {
              task_id: "p2t1",
              title: "Implement Task CRUD operations",
              completed: true,
            },
            {
              task_id: "p2t2",
              title: "Build Dashboard widgets",
              completed: true,
            },
            { task_id: "p2t3", title: "Add Task filtering", completed: true },
            {
              task_id: "p2t4",
              title: "Implement Project CRUD",
              completed: false,
            },
            {
              task_id: "p2t5",
              title: "Build Project Manager UI",
              completed: false,
            },
            {
              task_id: "p2t6",
              title: "Add Tech Stack management",
              completed: false,
            },
            {
              task_id: "p2t7",
              title: "Implement Phase system",
              completed: false,
            },
            {
              task_id: "p2t8",
              title: "Add Project filtering",
              completed: false,
            },
          ],
        },
        {
          phase_id: "phase3",
          title: "Module Expansion",
          description:
            "Expanding MyLifeOS with additional modules for different life domains. Planning to add Uni Hub for academic work, Finance module for budget tracking, Health module for wellness, and Social module for event planning.",
          status: "planning",
          tasks: "0/12",
          phaseItems: [
            {
              task_id: "p3t1",
              title: "Design Uni Hub module",
              completed: false,
            },
            {
              task_id: "p3t2",
              title: "Design Finance module",
              completed: false,
            },
            {
              task_id: "p3t3",
              title: "Design Health module",
              completed: false,
            },
            {
              task_id: "p3t4",
              title: "Design Social module",
              completed: false,
            },
            {
              task_id: "p3t5",
              title: "Implement Uni Hub backend",
              completed: false,
            },
            {
              task_id: "p3t6",
              title: "Implement Uni Hub frontend",
              completed: false,
            },
            {
              task_id: "p3t7",
              title: "Implement Finance backend",
              completed: false,
            },
            {
              task_id: "p3t8",
              title: "Implement Finance frontend",
              completed: false,
            },
            {
              task_id: "p3t9",
              title: "Implement Health tracking",
              completed: false,
            },
            {
              task_id: "p3t10",
              title: "Implement Social calendar",
              completed: false,
            },
            {
              task_id: "p3t11",
              title: "Add module navigation",
              completed: false,
            },
            {
              task_id: "p3t12",
              title: "Create module documentation",
              completed: false,
            },
          ],
        },
      ],
      tasks: [],
      totalTasks: 25,
      updatedAt: "2 hours ago",
    },
    {
      project_id: "2",
      title: "Portfolio Website",
      description:
        "Modern portfolio website showcasing projects and skills. Built with Next.js for optimal performance and SEO.",
      status: "planning" as ProjectStatus,
      githubUrl: "https://github.com/alex/portfolio",
      techStackIds: ["3", "2", "4"], // Next.js, TypeScript, Tailwind CSS
      phases: [],
      tasks: [
        { id: "t1", title: "Design landing page mockup", completed: false },
        {
          id: "t2",
          title: "Setup Next.js project structure",
          completed: false,
        },
        { id: "t3", title: "Configure Tailwind CSS", completed: false },
        { id: "t4", title: "Create navigation component", completed: false },
        { id: "t5", title: "Build project showcase section", completed: false },
      ],
      totalTasks: 8,
      updatedAt: "1 day ago",
    },
    {
      project_id: "3",
      title: "Go Learning Path",
      description:
        "Learning Go through building practical projects. Following best practices and clean architecture patterns.",
      status: "ongoing" as ProjectStatus,
      techStackIds: ["6", "9", "12"], // Go, PostgreSQL, Docker
      phases: [
        {
          phase_id: "phase4",
          title: "Basics & Syntax",
          description:
            "Learning the fundamentals of Go programming language including syntax, data structures, pointers, and concurrency primitives like goroutines and channels.",
          status: "finished",
          tasks: "6/6",
          phaseItems: [
            {
              task_id: "g1t1",
              title: "Learn Go basics and syntax",
              completed: true,
            },
            {
              task_id: "g1t2",
              title: "Understand pointers and structs",
              completed: true,
            },
            { task_id: "g1t3", title: "Learn Go routines", completed: true },
            { task_id: "g1t4", title: "Study channels", completed: true },
            {
              task_id: "g1t5",
              title: "Practice error handling",
              completed: true,
            },
            { task_id: "g1t6", title: "Build CLI calculator", completed: true },
          ],
        },
        {
          phase_id: "phase5",
          title: "Web Development",
          description:
            "Building web applications with Go. Learning HTTP handlers, routing with Chi, middleware patterns, database integration with pgx, and deploying production-ready APIs.",
          status: "ongoing",
          tasks: "4/10",
          phaseItems: [
            { task_id: "g2t1", title: "Learn HTTP handlers", completed: true },
            { task_id: "g2t2", title: "Study Chi router", completed: true },
            {
              task_id: "g2t3",
              title: "Understand middleware",
              completed: true,
            },
            {
              task_id: "g2t4",
              title: "Learn pgx for PostgreSQL",
              completed: true,
            },
            { task_id: "g2t5", title: "Build REST API", completed: false },
            {
              task_id: "g2t6",
              title: "Implement authentication",
              completed: false,
            },
            {
              task_id: "g2t7",
              title: "Add request validation",
              completed: false,
            },
            { task_id: "g2t8", title: "Write API tests", completed: false },
            {
              task_id: "g2t9",
              title: "Deploy to production",
              completed: false,
            },
            {
              task_id: "g2t10",
              title: "Document API endpoints",
              completed: false,
            },
          ],
        },
      ],
      tasks: [],
      totalTasks: 16,
      updatedAt: "3 hours ago",
    },
    {
      project_id: "4",
      title: "Microservices Architecture Study",
      description:
        "Deep dive into microservices patterns, inter-service communication, and distributed systems.",
      status: "onhold" as ProjectStatus,
      techStackIds: ["6", "7", "12", "13", "11"], // Go, Node.js, Docker, Kubernetes, Redis
      phases: [],
      tasks: [
        { id: "t6", title: "Research service mesh patterns", completed: false },
        { id: "t7", title: "Setup local Kubernetes cluster", completed: false },
        { id: "t8", title: "Implement API gateway service", completed: false },
        { id: "t9", title: "Configure Redis for caching", completed: false },
        {
          id: "t10",
          title: "Document architecture decisions",
          completed: false,
        },
      ],
      totalTasks: 15,
      updatedAt: "2 weeks ago",
    },
    {
      project_id: "5",
      title: "React Component Library",
      description:
        "Reusable component library with TypeScript and Storybook documentation.",
      status: "finished" as ProjectStatus,
      githubUrl: "https://github.com/alex/component-lib",
      liveUrl: "https://alex-components.netlify.app",
      techStackIds: ["1", "2", "5"], // React, TypeScript, Vite
      phases: [
        {
          phase_id: "phase6",
          title: "Core Components",
          description:
            "Building essential reusable React components with TypeScript. Focus on common UI elements like buttons, inputs, cards, modals, and form components with proper types and accessibility.",
          status: "finished",
          tasks: "8/8",
          phaseItems: [
            {
              task_id: "r1t1",
              title: "Build Button component",
              completed: true,
            },
            {
              task_id: "r1t2",
              title: "Build Input component",
              completed: true,
            },
            { task_id: "r1t3", title: "Build Card component", completed: true },
            {
              task_id: "r1t4",
              title: "Build Modal component",
              completed: true,
            },
            {
              task_id: "r1t5",
              title: "Build Dropdown component",
              completed: true,
            },
            {
              task_id: "r1t6",
              title: "Build Badge component",
              completed: true,
            },
            {
              task_id: "r1t7",
              title: "Build Table component",
              completed: true,
            },
            {
              task_id: "r1t8",
              title: "Build Form components",
              completed: true,
            },
          ],
        },
        {
          phase_id: "phase7",
          title: "Documentation",
          description:
            "Creating comprehensive documentation using Storybook. Writing stories for each component with usage examples, props documentation, and interactive demos.",
          status: "finished",
          tasks: "4/4",
          phaseItems: [
            { task_id: "r2t1", title: "Setup Storybook", completed: true },
            {
              task_id: "r2t2",
              title: "Write component stories",
              completed: true,
            },
            {
              task_id: "r2t3",
              title: "Create usage examples",
              completed: true,
            },
            { task_id: "r2t4", title: "Write README", completed: true },
          ],
        },
      ],
      tasks: [],
      totalTasks: 12,
      updatedAt: "1 month ago",
    },
    {
      project_id: "6",
      title: "API Gateway Experiment",
      description:
        "Building a custom API gateway to learn about routing, rate limiting, and authentication.",
      status: "testing" as ProjectStatus,
      githubUrl: "https://github.com/alex/api-gateway",
      techStackIds: ["6", "11", "12"], // Go, Redis, Docker
      phases: [],
      tasks: [
        {
          id: "t11",
          title: "Implement rate limiting middleware",
          completed: false,
        },
        { id: "t12", title: "Add JWT authentication", completed: false },
        { id: "t13", title: "Write integration tests", completed: false },
        { id: "t14", title: "Setup load testing", completed: false },
      ],
      totalTasks: 7,
      updatedAt: "5 hours ago",
    },
  ];

  // Helper function to get tech stack items for a project in sorted order
  const getTechStack = (techStackIds: string[]): TechStackItem[] => {
    return techStackIds
      .map((id) => TECH_STACK_ITEMS.find((item) => item.id === id))
      .filter((item): item is TechStackItem => item !== undefined)
      .sort((a, b) => a.position - b.position);
  };

  // Toggle tech stack filter
  const toggleTechStack = (techId: string) => {
    if (selectedTechStack.includes(techId)) {
      setSelectedTechStack(selectedTechStack.filter((id) => id !== techId));
    } else {
      setSelectedTechStack([...selectedTechStack, techId]);
    }
  };

  // Toggle tech stack in new project form
  const toggleNewProjectTechStack = (techId: string) => {
    if (newProject.techStackIds.includes(techId)) {
      setNewProject({
        ...newProject,
        techStackIds: newProject.techStackIds.filter((id) => id !== techId),
      });
    } else {
      setNewProject({
        ...newProject,
        techStackIds: [...newProject.techStackIds, techId],
      });
    }
  };

  // Reset and close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewProject({
      title: "",
      description: "",
      status: "idea",
      techStackIds: [],
      githubUrl: "",
      liveUrl: "",
    });
  };

  // Handle create (no functionality yet)
  const handleCreate = () => {
    console.log("Create project:", newProject);
    handleCloseModal();
  };

  // Open edit modal with project data
  const handleOpenEdit = () => {
    if (selectedProject) {
      setNewProject({
        title: selectedProject.title,
        description: selectedProject.description,
        status: selectedProject.status,
        techStackIds: selectedProject.techStackIds,
        githubUrl: selectedProject.githubUrl || "",
        liveUrl: selectedProject.liveUrl || "",
      });
      setShowDetailModal(false);
      setShowEditModal(true);
    }
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setShowDetailModal(true);
    setNewProject({
      title: "",
      description: "",
      status: "idea",
      techStackIds: [],
      githubUrl: "",
      liveUrl: "",
    });
  };

  // Handle update (no functionality yet)
  const handleUpdate = () => {
    console.log("Update project:", selectedProject?.project_id, newProject);
    setShowEditModal(false);
    setShowDetailModal(true);
  };

  // Open phase edit modal
  const handleOpenPhaseEdit = () => {
    if (selectedPhase) {
      setPhaseForm({
        title: selectedPhase.title,
        description: selectedPhase.description || "",
        status: (selectedPhase.status as ProjectStatus) || "idea",
      });
      setShowPhaseModal(false);
      setShowPhaseEditModal(true);
    }
  };

  // Close phase edit modal
  const handleClosePhaseEdit = () => {
    setShowPhaseEditModal(false);
    setShowPhaseModal(true);
    setPhaseForm({
      title: "",
      description: "",
      status: "idea",
    });
  };

  // Handle phase update (no functionality yet)
  const handlePhaseUpdate = () => {
    console.log("Update phase:", selectedPhase?.title, phaseForm);
    setShowPhaseEditModal(false);
    setShowPhaseModal(true);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 shrink-0">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Burger Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Title */}
                <h1 className="text-3xl font-bold">Project Manager</h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Main Content with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-120px)]">
          {/* Filters - Static */}
          <div className="px-6 py-6 shrink-0">
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <span className="text-sm font-medium mb-3 block">Status</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Filters */}
                  {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                    (status) => {
                      const config = PROJECT_STATUSES[status];
                      const Icon = config.icon;
                      const isSelected = statusFilter === status;

                      return (
                        <button
                          key={status}
                          onClick={() =>
                            setStatusFilter(isSelected ? "all" : status)
                          }
                          className="px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 hover:opacity-80"
                          style={{
                            backgroundColor: isSelected
                              ? config.color
                              : "transparent",
                            color: isSelected ? "#ffffff" : config.color,
                            border: `2px solid ${config.color}`,
                          }}
                        >
                          <Icon size={16} />
                          <span>{config.label}</span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Tech Stack Filter */}
              <div>
                <span className="text-sm font-medium mb-3 block">
                  Tech Stack
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {TECH_STACK_ITEMS.map((tech) => {
                    const isSelected = selectedTechStack.includes(tech.id);

                    return (
                      <button
                        key={tech.id}
                        onClick={() => toggleTechStack(tech.id)}
                        className="px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-80"
                        style={{
                          backgroundColor: isSelected
                            ? tech.color
                            : "transparent",
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
            </div>
          </div>

          {/* Project List */}
          <div className="px-6 pb-12">
            <div className="grid grid-cols-2 gap-4">
              {projects
                .filter((project) => {
                  const matchesStatus =
                    statusFilter === "all" || project.status === statusFilter;
                  const matchesTechStack =
                    selectedTechStack.length === 0 ||
                    selectedTechStack.some((techId) =>
                      project.techStackIds.includes(techId),
                    );
                  return matchesStatus && matchesTechStack;
                })
                .map((project) => (
                  <Card
                    key={project.project_id}
                    className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDetailModal(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">
                              {project.title}
                            </CardTitle>
                            {(() => {
                              const statusConfig =
                                PROJECT_STATUSES[project.status];
                              const StatusIcon = statusConfig.icon;
                              return (
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize gap-1.5 font-medium"
                                  style={{
                                    borderColor: statusConfig.color,
                                    color: statusConfig.color,
                                  }}
                                >
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {statusConfig.label}
                                </Badge>
                              );
                            })()}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-4">
                      {/* Tech Stack */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTechStack(project.techStackIds).map((tech) => (
                          <Badge
                            key={tech.id}
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
                      {project.phases.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Phases:</p>
                          <div className="space-y-1">
                            {project.phases.slice(0, 3).map((phase) => (
                              <div
                                key={phase.phase_id}
                                className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPhase(phase);
                                  setShowPhaseModal(true);
                                }}
                              >
                                <span className="text-muted-foreground">
                                  {phase.title}
                                </span>
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
                        project.tasks &&
                        project.tasks.filter((t) => !t.completed).length >
                          0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Tasks:</p>
                            <div className="space-y-1">
                              {project.tasks
                                .filter((t) => !t.completed)
                                .slice(0, 3)
                                .map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
                                  >
                                    <span className="text-muted-foreground">
                                      ☐
                                    </span>
                                    <span className="text-muted-foreground flex-1">
                                      {task.title}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      )}

                      {/* Footer Info */}
                      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📊 {project.totalTasks} Tasks</span>
                          {project.phases.length > 0 && (
                            <span>• {project.phases.length} Phases</span>
                          )}
                          <span>• Updated {project.updatedAt}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g. Portfolio Website"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your project..."
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2">Status *</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: ProjectStatus) =>
                      setNewProject({ ...newProject, status: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                        (status) => {
                          const config = PROJECT_STATUSES[status];
                          const Icon = config.icon;
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="w-4 h-4"
                                  style={{ color: config.color }}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tech Stack */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Tech Stack
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {TECH_STACK_ITEMS.map((tech) => {
                      const isSelected = newProject.techStackIds.includes(
                        tech.id,
                      );
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => toggleNewProjectTechStack(tech.id)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
                          style={{
                            backgroundColor: isSelected
                              ? tech.color
                              : "transparent",
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
                  <Label
                    htmlFor="githubUrl"
                    className="text-sm font-medium mb-2"
                  >
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={newProject.githubUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({
                        ...newProject,
                        githubUrl: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <Label htmlFor="liveUrl" className="text-sm font-medium mb-2">
                    Live URL
                  </Label>
                  <Input
                    id="liveUrl"
                    type="text"
                    placeholder="https://your-project.com"
                    value={newProject.liveUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, liveUrl: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={
                    !newProject.title ||
                    !newProject.description ||
                    newProject.techStackIds.length === 0
                  }
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        {showDetailModal && selectedProject && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDetailModal(false);
              setSelectedProject(null);
            }}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      {selectedProject.title}
                    </h2>
                    {(() => {
                      const statusConfig =
                        PROJECT_STATUSES[selectedProject.status];
                      const StatusIcon = statusConfig.icon;
                      return (
                        <Badge
                          variant="outline"
                          className="text-sm gap-1.5 font-medium"
                          style={{
                            borderColor: statusConfig.color,
                            color: statusConfig.color,
                          }}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </Badge>
                      );
                    })()}
                  </div>
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedProject(null);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Tech Stack */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Tech Stack</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTechStack(selectedProject.techStackIds).map((tech) => (
                      <Badge
                        key={tech.id}
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
                </div>

                {/* Links */}
                {(selectedProject.githubUrl || selectedProject.liveUrl) && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Links</h3>
                    <div className="flex items-center gap-3">
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                          GitHub Repository
                        </a>
                      )}
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Phases OR Tasks */}
                {selectedProject.phases.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Phases ({selectedProject.phases.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedProject.phases.map((phase) => (
                        <div
                          key={phase.phase_id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedPhase(phase);
                            setShowPhaseModal(true);
                          }}
                        >
                          <span className="text-sm font-medium">
                            {phase.title}
                          </span>
                          <div className="flex items-center gap-3">
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
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">
                        Tasks (
                        {selectedProject.tasks
                          ? selectedProject.tasks.filter((t) => !t.completed)
                              .length
                          : 0}{" "}
                        remaining)
                      </h3>
                      <button
                        onClick={() => setShowTaskChoiceModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task
                      </button>
                    </div>
                    {selectedProject.tasks &&
                    selectedProject.tasks.filter((t) => !t.completed).length >
                      0 ? (
                      <div className="space-y-2">
                        {selectedProject.tasks
                          .filter((t) => !t.completed)
                          .map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:bg-muted transition-colors group"
                            >
                              <span className="text-muted-foreground">☐</span>
                              <span className="text-sm flex-1">
                                {task.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Remove task:", task.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No tasks in this project yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>📊 {selectedProject.totalTasks} Total Tasks</span>
                    {selectedProject.phases.length > 0 && (
                      <span>• {selectedProject.phases.length} Phases</span>
                    )}
                    <span>• Updated {selectedProject.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() =>
                    console.log("Delete project:", selectedProject.project_id)
                  }
                  className="px-4 py-2 rounded-md text-destructive border border-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={handleOpenEdit}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseEdit}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Edit Project</h2>
                <button
                  onClick={handleCloseEdit}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label
                    htmlFor="edit-title"
                    className="text-sm font-medium mb-2"
                  >
                    Title *
                  </Label>
                  <Input
                    id="edit-title"
                    type="text"
                    placeholder="e.g. Portfolio Website"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="edit-description"
                    className="text-sm font-medium mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Brief description of your project..."
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2">Status *</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: ProjectStatus) =>
                      setNewProject({ ...newProject, status: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                        (status) => {
                          const config = PROJECT_STATUSES[status];
                          const Icon = config.icon;
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="w-4 h-4"
                                  style={{ color: config.color }}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tech Stack */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Tech Stack
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {TECH_STACK_ITEMS.map((tech) => {
                      const isSelected = newProject.techStackIds.includes(
                        tech.id,
                      );
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => toggleNewProjectTechStack(tech.id)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
                          style={{
                            backgroundColor: isSelected
                              ? tech.color
                              : "transparent",
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
                  <Label
                    htmlFor="edit-githubUrl"
                    className="text-sm font-medium mb-2"
                  >
                    GitHub URL
                  </Label>
                  <Input
                    id="edit-githubUrl"
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={newProject.githubUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({
                        ...newProject,
                        githubUrl: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <Label
                    htmlFor="edit-liveUrl"
                    className="text-sm font-medium mb-2"
                  >
                    Live URL
                  </Label>
                  <Input
                    id="edit-liveUrl"
                    type="text"
                    placeholder="https://your-project.com"
                    value={newProject.liveUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, liveUrl: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={
                    !newProject.title ||
                    !newProject.description ||
                    newProject.techStackIds.length === 0
                  }
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase Detail Modal */}
        {showPhaseModal && selectedPhase && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowPhaseModal(false);
              setSelectedPhase(null);
            }}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      {selectedPhase.title}
                    </h2>
                    {(() => {
                      const statusConfig =
                        PROJECT_STATUSES[selectedPhase.status as ProjectStatus];
                      if (statusConfig) {
                        const StatusIcon = statusConfig.icon;
                        return (
                          <Badge
                            variant="outline"
                            className="text-sm gap-1.5 font-medium"
                            style={{
                              borderColor: statusConfig.color,
                              color: statusConfig.color,
                            }}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </Badge>
                        );
                      }
                      return (
                        <Badge variant="outline" className="text-sm">
                          {selectedPhase.status}
                        </Badge>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedPhase.tasks}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPhaseModal(false);
                    setSelectedPhase(null);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                {selectedPhase.description && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedPhase.description}
                    </p>
                  </div>
                )}

                {/* Tasks */}
                {selectedPhase.phaseItems &&
                selectedPhase.phaseItems.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">
                        Tasks (
                        {
                          selectedPhase.phaseItems.filter((t) => t.completed)
                            .length
                        }
                        /{selectedPhase.phaseItems.length})
                      </h3>
                      <button
                        onClick={() => setShowTaskChoiceModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedPhase.phaseItems.map((task) => (
                        <div
                          key={task.task_id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:bg-muted transition-colors group"
                        >
                          <span className="text-muted-foreground">
                            {task.completed ? "☑" : "☐"}
                          </span>
                          <span
                            className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Remove task:", task.task_id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Tasks (0)</h3>
                      <button
                        onClick={() => setShowTaskChoiceModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task
                      </button>
                    </div>
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No tasks in this phase yet.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() => {
                    setShowPhaseModal(false);
                    setSelectedPhase(null);
                  }}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleOpenPhaseEdit}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                >
                  Edit Phase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase Edit Modal */}
        {showPhaseEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClosePhaseEdit}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Edit Phase</h2>
                <button
                  onClick={handleClosePhaseEdit}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <Label
                    htmlFor="phase-name"
                    className="text-sm font-medium mb-2"
                  >
                    Phase Title *
                  </Label>
                  <Input
                    id="phase-name"
                    type="text"
                    placeholder="e.g. Setup & Architecture"
                    value={phaseForm.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhaseForm({ ...phaseForm, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="phase-description"
                    className="text-sm font-medium mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="phase-description"
                    placeholder="Describe the goals and scope of this phase..."
                    value={phaseForm.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setPhaseForm({
                        ...phaseForm,
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2">Status *</Label>
                  <Select
                    value={phaseForm.status}
                    onValueChange={(value: ProjectStatus) =>
                      setPhaseForm({ ...phaseForm, status: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                        (status) => {
                          const config = PROJECT_STATUSES[status];
                          const Icon = config.icon;
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="w-4 h-4"
                                  style={{ color: config.color }}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={handleClosePhaseEdit}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhaseUpdate}
                  disabled={!phaseForm.title}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Choice Modal */}
        {showTaskChoiceModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTaskChoiceModal(false)}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Add Task</h2>
                <button
                  onClick={() => setShowTaskChoiceModal(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                <button
                  onClick={() => {
                    setShowTaskChoiceModal(false);
                    setShowAddTaskModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-md border border-border hover:bg-muted transition-colors text-left"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Add Existing Task</p>
                    <p className="text-sm text-muted-foreground">
                      Link a task that already exists in your task list
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowTaskChoiceModal(false);
                    setShowCreateTaskModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-md border border-border hover:bg-muted transition-colors text-left"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Create New Task</p>
                    <p className="text-sm text-muted-foreground">
                      Create a new task and add it to this phase
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Existing Task Modal */}
        {showAddTaskModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddTaskModal(false);
              setShowTaskChoiceModal(true);
            }}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Add Existing Task</h2>
                <button
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setShowTaskChoiceModal(true);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & List */}
              <div className="p-6 space-y-4">
                {/* Search */}
                <div>
                  <Input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full"
                  />
                </div>

                {/* Task List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Search functionality coming with backend integration...
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setShowTaskChoiceModal(true);
                  }}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Task Modal */}
        {showCreateTaskModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateTaskModal(false);
              setShowTaskChoiceModal(true);
            }}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Create New Task</h2>
                <button
                  onClick={() => {
                    setShowCreateTaskModal(false);
                    setShowTaskChoiceModal(true);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label
                    htmlFor="task-title"
                    className="text-sm font-medium mb-2"
                  >
                    Title *
                  </Label>
                  <Input
                    id="task-title"
                    type="text"
                    placeholder="e.g. Build authentication system"
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="task-description"
                    className="text-sm font-medium mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="task-description"
                    placeholder="Brief description of the task..."
                    className="mt-2"
                  />
                </div>

                {/* Domain & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Domain</Label>
                    <Select defaultValue="coding">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() => {
                    setShowCreateTaskModal(false);
                    setShowTaskChoiceModal(true);
                  }}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Create task for phase");
                    setShowCreateTaskModal(false);
                    // Go back to phase modal if open, otherwise to project detail modal
                    if (selectedPhase) {
                      setShowPhaseModal(true);
                    } else if (selectedProject) {
                      setShowDetailModal(true);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
