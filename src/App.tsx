/**
 * Task board application shell.
 *
 * @author Alfie
 */

import { useCallback, useEffect, useState } from 'react'
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from './api'
import TaskForm, { type TaskFormInput } from './components/TaskForm'
import TaskList from './components/TaskList'

type StatusFilter = TaskStatus | 'all'
type PriorityFilter = TaskPriority | 'all'

/**
 * Load tasks, create tasks and move them through the status workflow.
 *
 * @author Alfie
 */
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch tasks for the active status and priority filters.
   *
   * @author Alfie
   */
  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await listTasks({
        status: filter === 'all' ? undefined : filter,
        priority: priorityFilter === 'all' ? undefined : priorityFilter,
      })
      setTasks(next)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filter, priorityFilter])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  /**
   * Create a task and refresh the list.
   *
   * @author Alfie
   */
  async function handleCreate(input: TaskFormInput) {
    await createTask(input)
    await loadTasks()
  }

  /**
   * Move a task to a new status and refresh the list.
   *
   * @author Alfie
   */
  async function handleAdvance(task: Task, nextStatus: TaskStatus) {
    await updateTask(task.id, { status: nextStatus })
    await loadTasks()
  }

  /**
   * Delete a task after confirmation and refresh the list.
   *
   * @author Alfie
   */
  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete “${task.title}”?`)) {
      return
    }
    await deleteTask(task.id)
    await loadTasks()
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Devin multi-repository demo</p>
          <h1>Task Board</h1>
          <p className="subtitle">
            A small React client backed by the FastAPI task service.
          </p>
        </div>
        <div className="header-actions">
          <label className="filter-label" htmlFor="status-filter">
            Filter
          </label>
          <select
            id="status-filter"
            className="select-input"
            value={filter}
            onChange={(event) => setFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
          <label className="filter-label" htmlFor="priority-filter">
            Priority
          </label>
          <select
            id="priority-filter"
            className="select-input"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </header>

      <TaskForm onCreate={handleCreate} />

      {error ? (
        <div className="error-banner" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="loading-state">Loading tasks…</p>
      ) : (
        <TaskList tasks={tasks} onAdvance={handleAdvance} onDelete={handleDelete} />
      )}
    </main>
  )
}
