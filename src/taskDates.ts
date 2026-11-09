/**
 * Date helpers for task due dates.
 *
 * @author Alfie
 */

import type { Task } from './api'

/**
 * Return today's local calendar date as `YYYY-MM-DD`.
 *
 * @author Alfie
 */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * A task is overdue when it is not done and its due date is before today.
 *
 * @author Alfie
 */
export function isOverdue(task: Pick<Task, 'status' | 'due_date'>, today: string = todayIso()): boolean {
  return task.status !== 'done' && task.due_date !== null && task.due_date < today
}
