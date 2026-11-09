/**
 * Helpers for `YYYY-MM-DD` calendar dates used as task due dates.
 *
 * @author Alfie
 */

import type { Task } from './api'

/**
 * Return the given moment as a local `YYYY-MM-DD` calendar date.
 *
 * @author Alfie
 */
export function toIsoDate(moment: Date = new Date()): string {
  const year = moment.getFullYear()
  const month = String(moment.getMonth() + 1).padStart(2, '0')
  const day = String(moment.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * A task is overdue when it is not done and its due date is before today.
 *
 * @author Alfie
 */
export function isOverdue(task: Pick<Task, 'status' | 'due_date'>, today: string = toIsoDate()): boolean {
  return task.status !== 'done' && task.due_date !== null && task.due_date < today
}

/**
 * Format a `YYYY-MM-DD` date for display without shifting it across time zones.
 *
 * @author Alfie
 */
export function formatDueDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}
