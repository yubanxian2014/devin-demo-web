/**
 * Behaviour tests for the task board shell.
 *
 * @author Alfie
 */

import { render, screen, waitFor } from '@testing-library/react'
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
    expect(mockedApi.listTasks).toHaveBeenCalledWith(undefined)
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
})
