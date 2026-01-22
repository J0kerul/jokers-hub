package task

import (
	"context"

	"github.com/google/uuid"
)

type TaskRepositoryInterface interface {
	Create(ctx context.Context, task *Task) error
	Update(ctx context.Context, task *Task) error
	GetById(ctx context.Context, taskid uuid.UUID) (*Task, error)
	GetAll(ctx context.Context) ([]*Task, error)
	Delete(ctx context.Context, taskid uuid.UUID) error
	ToggleStatus(ctx context.Context, taskid uuid.UUID) error
}

type TaskServiceInterface interface {
	CreateTask(ctx context.Context, task *Task) error
	UpdateTask(ctx context.Context, task *Task) error
	GetTaskById(ctx context.Context, taskid uuid.UUID) (*Task, error)
	GetAllTasks(ctx context.Context) ([]*Task, error)
	DeleteTask(ctx context.Context, taskid uuid.UUID) error
	ToggleStatus(ctx context.Context, taskid uuid.UUID) error
}
