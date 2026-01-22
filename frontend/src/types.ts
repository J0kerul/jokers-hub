export type Task = {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  domain: string
  deadline?: string
  isBacklog: boolean
  createdAt: string
}