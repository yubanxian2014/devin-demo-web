/**
 * Task list with an empty state.
 *
 * @author Alfie
 */

import type { Task, TaskStatus } from '../api'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onAdvance: (task: Task, nextStatus: TaskStatus) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}

/**
 * Render every task or a friendly empty state.
 *
 * @author Alfie
 */
export default function TaskList({ tasks, onAdvance, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above to get started.</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onAdvance={onAdvance} onDelete={onDelete} />
      ))}
    </div>
  )
}
