/**
 * Form used to create a task.
 *
 * @author Alfie
 */

import { useState, type FormEvent } from 'react'
import type { TaskStatus } from '../api'

interface TaskFormProps {
  onCreate: (input: {
    title: string
    description: string | null
    status: TaskStatus
  }) => Promise<void>
}

/**
 * Collect title, description and initial status, then delegate creation.
 *
 * @author Alfie
 */
export default function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [submitting, setSubmitting] = useState(false)

  /**
   * Submit the form when the title is non-empty.
   *
   * @author Alfie
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || submitting) {
      return
    }
    setSubmitting(true)
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || null,
        status,
      })
      setTitle('')
      setDescription('')
      setStatus('todo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          aria-label="Task title"
          className="text-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <select
          aria-label="Initial status"
          className="select-input"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
        >
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <button className="primary-button" type="submit" disabled={!title.trim() || submitting}>
          {submitting ? 'Adding…' : 'Add task'}
        </button>
      </div>
      <textarea
        aria-label="Task description"
        className="text-area"
        placeholder="Optional details"
        rows={2}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
    </form>
  )
}
