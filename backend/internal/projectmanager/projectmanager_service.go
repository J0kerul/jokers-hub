package projectmanager

import (
	"context"
	"fmt"

	errorutils "github.com/J0kerul/jokers-hub/pkg/errors"
)

type ProjectManagerService struct {
	repo ProjectManagerRepositoryInterface
}

func NewProjectManagerService(repo ProjectManagerRepositoryInterface) *ProjectManagerService {
	return &ProjectManagerService{repo: repo}
}

func (s *ProjectManagerService) CreateProjectSrc(ctx context.Context, project *Project) error {
	// Validate project fields
	if err := checkFields(*project); err != nil {
		return err
	}

	// Create project in the repository
	err := s.repo.CreateProject(ctx, project)
	if err != nil {
		return fmt.Errorf("failed to create Project: %w", err)
	}
	return nil
}

func checkFields(project Project) error {
	if project.Title == "" {
		return errorutils.ErrTitleRequired
	}

	if project.Description == "" {
		return errorutils.ErrMissingDescription
	}

	if !isValidStatus(project.Status) {
		return errorutils.ErrInvalidStatus
	}

	if len(project.TechStackIds) == 0 {
		return errorutils.ErrNoTechStackItems
	}

	return nil
}

func isValidStatus(status Status) bool {
	switch status {
	case StatusIdea, StatusPlanning, StatusOngoing, StatusTesting,
		StatusBugFixes, StatusDeployed, StatusFinished,
		StatusArchived, StatusOnHold, StatusRefactoring:
		return true
	default:
		return false
	}
}
