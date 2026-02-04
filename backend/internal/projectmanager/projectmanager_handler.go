package projectmanager

import (
	"encoding/json"
	"fmt"
	"net/http"

	errorutils "github.com/J0kerul/jokers-hub/pkg/errors"
	"github.com/J0kerul/jokers-hub/pkg/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type CreateProjectRequest struct {
	Title       string      `json:"title" validate:"required"`
	Description string      `json:"description" validate:"required"`
	TechStack   []uuid.UUID `json:"tech_stack_ids" validate:"required"`
	Status      Status      `json:"status" validate:"required"`
	GithubUrl   *string     `json:"github_url,omitempty"`
	LiveUrl     *string     `json:"live_url,omitempty"`
}

type ProjectResponse struct {
	ProjectId   uuid.UUID   `json:"project_id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	TechStack   []uuid.UUID `json:"tech_stack_ids"`
	Status      Status      `json:"status"`
	GithubUrl   *string     `json:"github_url,omitempty"`
	LiveUrl     *string     `json:"live_url,omitempty"`
	CreatedAt   string      `json:"created_at"`
	UpdatedAt   string      `json:"updated_at"`
}

type ProjectManagerHandler struct {
	ProjectManagerService ProjectManagerServiceInterface
}

func NewProjectManagerHandler(
	projectManagerService ProjectManagerServiceInterface,
) *ProjectManagerHandler {
	return &ProjectManagerHandler{
		ProjectManagerService: projectManagerService,
	}
}

func (h *ProjectManagerHandler) createProject(w http.ResponseWriter, r *http.Request) {
	// 1. Parse request body
	var req CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithBadRequest(w, "Invalid request body")
		return
	}

	// 2. DTO -> Entity
	project := &Project{
		Title:        req.Title,
		Description:  req.Description,
		Status:       req.Status,
		GithubUrl:    req.GithubUrl,
		LiveUrl:      req.LiveUrl,
		TechStackIds: req.TechStack,
	}

	// 3. Call service to create project
	err := h.ProjectManagerService.CreateProjectSrc(r.Context(), project)
	if err != nil {
		if isValidationError(err) {
			utils.RespondWithBadRequest(w, err.Error())
			return
		}
		utils.RespondWithInternalError(w, fmt.Sprintf("Failed to create project: %v", err))
		return
	}

	// 4. Entity -> Response DTO
	resp := projectToResponse(project)

	// 5. Send response
	utils.RespondWithJSON(w, http.StatusCreated, resp)
}

func isValidationError(err error) bool {
	switch err {
	case errorutils.ErrTitleRequired,
		errorutils.ErrMissingDescription,
		errorutils.ErrInvalidStatus,
		errorutils.ErrNoTechStackItems:
		return true
	default:
		return false
	}
}

func projectToResponse(project *Project) *ProjectResponse {
	return &ProjectResponse{
		ProjectId:   project.ProjectId,
		Title:       project.Title,
		Description: project.Description,
		TechStack:   project.TechStackIds,
		Status:      project.Status,
		GithubUrl:   project.GithubUrl,
		LiveUrl:     project.LiveUrl,
		CreatedAt:   project.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   project.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func RegisterRoutes(r chi.Router, handler *ProjectManagerHandler) {
	r.Route("/projects", func(r chi.Router) {
		// Create Project
		r.Post("/", handler.createProject)
	})
}
