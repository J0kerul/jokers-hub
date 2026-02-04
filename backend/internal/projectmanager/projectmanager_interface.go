package projectmanager

import "context"

type ProjectManagerRepositoryInterface interface {
	CreateProject(ctx context.Context, project *Project) error
}

type ProjectManagerServiceInterface interface {
	CreateProjectSrc(ctx context.Context, project *Project) error
}
