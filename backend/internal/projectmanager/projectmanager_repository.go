package projectmanager

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ProjectManagerRepo struct {
	db *pgxpool.Pool
}

func NewProjectManagerRepo(db *pgxpool.Pool) *ProjectManagerRepo {
	return &ProjectManagerRepo{db: db}
}

func (r *ProjectManagerRepo) CreateProject(ctx context.Context, project *Project) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer tx.Rollback(ctx)

	query := `INSERT INTO projects (title, description, status, github_url, live_url) VALUES ($1, $2, $3, $4, $5) RETURNING project_id, created_at, updated_at`
	err = tx.QueryRow(ctx, query,
		project.Title,
		project.Description,
		project.Status,
		project.GithubUrl,
		project.LiveUrl,
	).Scan(&project.ProjectId, &project.CreatedAt, &project.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create project: %w", err)
	}

	for _, techStackId := range project.TechStackIds {
		_, err = tx.Exec(ctx, `INSERT INTO project_tech_stack (project_id, tech_stack_item_id) VALUES ($1, $2)`, project.ProjectId, techStackId)
		if err != nil {
			return fmt.Errorf("failed to associate tech stack item with project: %w", err)
		}
	}

	return tx.Commit(ctx)
}
