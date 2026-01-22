package task

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

type TaskService struct {
	TaskRepo TaskRepo
}

func NewTaskService(TaskRepository TaskRepo) *TaskService {
	return &TaskService{
		TaskRepo: TaskRepository,
	}
}

func (s *TaskService) CreateTask(ctx context.Context, task *Task) error {
	// Check for required fields
	err := checkFields(*task)
	if err != nil {
		return err
	}

	// Create Task
	err = s.TaskRepo.Create(ctx, task)
	if err != nil {
		return err
	}

	return nil
}

func (s *TaskService) UpdateTask(ctx context.Context, task *Task) error {
	// Check for required fields
	err := checkFields(*task)
	if err != nil {
		return err
	}
	// Update Task
	err = s.TaskRepo.Update(ctx, task)
	if err != nil {
		return err
	}

	return nil
}

func (s *TaskService) GetTaskById(ctx context.Context, taskid uuid.UUID) (*Task, error) {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return nil, errors.New("task id cannot be nil")
	}
	// Check if id exists and get it
	task, err := s.TaskRepo.GetById(ctx, taskid)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s *TaskService) GetAllTasks(ctx context.Context) ([]*Task, error) {
	return s.TaskRepo.GetAll(ctx)
}

func (s *TaskService) DeleteTask(ctx context.Context, taskid uuid.UUID) error {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return errors.New("task id cannot be nil")
	}

	// Delete id
	err := s.TaskRepo.Delete(ctx, taskid)
	if err != nil {
		return err
	}

	return nil
}

func (s *TaskService) ToggleStatus(ctx context.Context, taskid uuid.UUID) error {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return errors.New("task id cannot be nil")
	}

	err := s.TaskRepo.ToggleStatus(ctx, taskid)
	if err != nil {
		return err
	}

	return nil
}

func checkFields(task Task) error {
	// Check title
	if task.Title == "" {
		return errors.New("task title shouldn't be empty")
	}

	// Check Priority Validation
	if !isPrioValid(task.Priority) {
		return errors.New("task Priority should be 'high', 'medium' or 'low")
	}

	// Check Domain Validation
	if !isDomainValid(task.Domain) {
		return errors.New("task Domain should be one of the following: 'work', 'university', 'personal', 'coding', 'health', 'finance', 'social', 'home', 'study', 'travel' or 'administration'")
	}

	// Check if deadline exists if task is not marked as backlog
	if task.Deadline == nil && !task.IsBacklog {
		return errors.New("non Backlog Task has to have a deadline")
	}

	// Check the other way around
	if task.IsBacklog && task.Deadline != nil {
		return errors.New("backlog task should not have a deadline")

	}

	return nil
}

func isPrioValid(p Priority) bool {
	switch p {
	case PriorityHigh, PriorityLow, PriorityMedium:
		return true
	default:
		return false
	}
}

func isDomainValid(d Domain) bool {
	switch d {
	case DomainWork, DomainUniversity, DomainPersonal, DomainCoding, DomainHealth, DomainFinance, DomainSocial, DomainHome, DomainStudy, DomainTravel, DomainAdministration:
		return true
	default:
		return false
	}
}
