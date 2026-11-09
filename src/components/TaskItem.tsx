/**
 * One task card with status actions.
 *
 * @author Alfie
 */

import type { Task, TaskPriority, TaskStatus } from '../api'
import { isOverdue } from '../taskDates'

interface TaskItemProps {
  task: Task
  onAdvance: (task: Task, nextStatus: TaskStatus) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  doing: 'Doing',
  done: 'Done',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

/**
 * Return the next status in the todo → doing → done workflow.
 *
 * @author Alfie
 */
function nextStatus(status: TaskStatus): TaskStatus | null {
  if (status === 'todo') return 'doing'
  if (status === 'doing') return 'done'
  return null
}

/**
 * Render a task, its status badge and the available actions.
 *
 * @author Alfie
 */
export default function TaskItem({ task, onAdvance, onDelete }: TaskItemProps) {
  const next = nextStatus(task.status)
  const overdue = isOverdue(task)

  return (
    <article className={`task-card status-${task.status}${overdue ? ' task-card-overdue' : ''}`}>
      <div className="task-card-main">
        <div className="task-card-heading">
          <h3>{task.title}</h3>
          <span className={`status-badge status-badge-${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`priority-badge priority-badge-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]} priority
          </span>
        </div>
        {task.due_date ? (
          <p className={`task-due-date${overdue ? ' task-due-date-overdue' : ''}`}>
            Due <time dateTime={task.due_date}>{task.due_date}</time>
            {overdue ? <span className="overdue-label">Overdue</span> : null}
          </p>
        ) : null}
        {task.description ? <p className="task-description">{task.description}</p> : null}
      </div>
      <div className="task-card-actions">
        {next ? (
          <button className="secondary-button" type="button" onClick={() => void onAdvance(task, next)}>
            {next === 'doing' ? 'Start' : 'Mark done'}
          </button>
        ) : (
          <button
            className="secondary-button"
            type="button"
            onClick={() => void onAdvance(task, 'todo')}
          >
            Reopen
          </button>
        )}
        <button className="danger-button" type="button" onClick={() => void onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  )
}
