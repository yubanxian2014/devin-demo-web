/**
 * Behaviour tests for the task board shell.
 *
 * @author Alfie
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import * as api from './api'

vi.mock('./api', () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

const mockedApi = vi.mocked(api)

const sampleTask: api.Task = {
  id: 1,
  title: 'Write the demo',
  description: 'Ship it',
  status: 'todo',
  priority: 'medium',
  due_date: null,
  created_at: '2026-11-09T10:00:00Z',
  updated_at: '2026-11-09T10:00:00Z',
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedApi.listTasks.mockResolvedValue([sampleTask])
    mockedApi.createTask.mockResolvedValue({ ...sampleTask, id: 2, title: 'New task' })
    mockedApi.updateTask.mockResolvedValue({ ...sampleTask, status: 'doing' })
    mockedApi.deleteTask.mockResolvedValue(undefined)
    window.confirm = vi.fn(() => true)
  })

  it('renders tasks returned by the API', async () => {
    render(<App />)

    expect(await screen.findByText('Write the demo')).toBeInTheDocument()
    expect(screen.getByText('Ship it')).toBeInTheDocument()
    expect(mockedApi.listTasks).toHaveBeenCalledWith({ status: undefined, priority: undefined })
  })

  it('creates a task and refreshes the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Write the demo')

    await user.type(screen.getByLabelText('Task title'), 'New task')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() =>
      expect(mockedApi.createTask).toHaveBeenCalledWith({
        title: 'New task',
        description: null,
        status: 'todo',
        priority: 'medium',
        due_date: null,
      }),
    )
    expect(mockedApi.listTasks).toHaveBeenCalledTimes(2)
  })

  it('moves a todo task to doing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Write the demo')

    await user.click(screen.getByRole('button', { name: 'Start' }))

    await waitFor(() =>
      expect(mockedApi.updateTask).toHaveBeenCalledWith(1, { status: 'doing' }),
    )
  })

  it('deletes a task after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Write the demo')

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(mockedApi.deleteTask).toHaveBeenCalledWith(1))
  })

  it('shows an error when loading fails', async () => {
    mockedApi.listTasks.mockRejectedValueOnce(new Error('API is down'))
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('API is down')
  })

  it('creates a task with a priority and due date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Write the demo')

    await user.type(screen.getByLabelText('Task title'), 'Urgent task')
    await user.selectOptions(screen.getByLabelText('Task priority'), 'high')
    await user.type(screen.getByLabelText('Task due date'), '2026-12-31')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() =>
      expect(mockedApi.createTask).toHaveBeenCalledWith({
        title: 'Urgent task',
        description: null,
        status: 'todo',
        priority: 'high',
        due_date: '2026-12-31',
      }),
    )
    expect(screen.getByLabelText('Task priority')).toHaveValue('medium')
    expect(screen.getByLabelText('Task due date')).toHaveValue('')
  })

  it('filters tasks by priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Write the demo')

    await user.selectOptions(screen.getByLabelText('Priority', { selector: '#priority-filter' }), 'high')

    await waitFor(() =>
      expect(mockedApi.listTasks).toHaveBeenLastCalledWith({ status: undefined, priority: 'high' }),
    )

    await user.selectOptions(screen.getByLabelText('Filter'), 'doing')

    await waitFor(() =>
      expect(mockedApi.listTasks).toHaveBeenLastCalledWith({ status: 'doing', priority: 'high' }),
    )
  })

  it('shows priority and due date on the card', async () => {
    mockedApi.listTasks.mockResolvedValue([
      { ...sampleTask, priority: 'high', due_date: '2999-12-31' },
    ])
    render(<App />)

    const card = (await screen.findByText('Write the demo')).closest('article')!
    expect(within(card).getByText('High priority')).toBeInTheDocument()
    expect(within(card).getByText('2999-12-31')).toHaveAttribute('dateTime', '2999-12-31')
    expect(within(card).queryByText('Overdue')).not.toBeInTheDocument()
    expect(card).not.toHaveClass('task-card-overdue')
  })

  it('omits the due date line when a task has none', async () => {
    render(<App />)

    const card = (await screen.findByText('Write the demo')).closest('article')!
    expect(within(card).getByText('Medium priority')).toBeInTheDocument()
    expect(within(card).queryByText(/^Due/)).not.toBeInTheDocument()
  })

  it('highlights overdue tasks but not finished ones', async () => {
    mockedApi.listTasks.mockResolvedValue([
      { ...sampleTask, id: 1, title: 'Late task', due_date: '2000-01-01' },
      { ...sampleTask, id: 2, title: 'Late but done', status: 'done', due_date: '2000-01-01' },
    ])
    render(<App />)

    const late = (await screen.findByText('Late task')).closest('article')!
    expect(late).toHaveClass('task-card-overdue')
    expect(within(late).getByText('Overdue')).toBeInTheDocument()

    const done = screen.getByText('Late but done').closest('article')!
    expect(done).not.toHaveClass('task-card-overdue')
    expect(within(done).queryByText('Overdue')).not.toBeInTheDocument()
  })
})
