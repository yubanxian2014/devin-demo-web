/**
 * Thin typed client for the task board API.
 *
 * @author Alfie
 */

export type TaskStatus = 'todo' | 'doing' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  /** Calendar date in `YYYY-MM-DD` format, or `null` when unset. */
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface TaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/**
 * Perform a JSON request and turn non-2xx responses into readable errors.
 *
 * @author Alfie
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/**
 * List tasks, optionally filtered by status and/or priority.
 *
 * @author Alfie
 */
export function listTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  const query = params.toString()
  return request<Task[]>(query ? `/tasks?${query}` : '/tasks')
}

/**
 * Create a task.
 *
 * @author Alfie
 */
export function createTask(input: TaskInput): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/**
 * Partially update a task.
 *
 * @author Alfie
 */
export function updateTask(id: number, input: Partial<TaskInput>): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

/**
 * Delete a task.
 *
 * @author Alfie
 */
export function deleteTask(id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' })
}
