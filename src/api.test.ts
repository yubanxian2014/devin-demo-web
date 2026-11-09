/**
 * Tests for the typed API client.
 *
 * @author Alfie
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTask, listTasks, updateTask } from './api'

const fetchMock = vi.fn()

/**
 * Build a JSON response for the mocked fetch.
 *
 * @author Alfie
 */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('api client', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => jsonResponse([]))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lists tasks without a query string by default', async () => {
    await listTasks()
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/tasks')
  })

  it('passes status and priority filters as query parameters', async () => {
    await listTasks({ priority: 'high' })
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/tasks?priority=high')

    await listTasks({ status: 'doing', priority: 'low' })
    expect(fetchMock.mock.calls[1][0]).toBe('http://localhost:8000/tasks?status=doing&priority=low')
  })

  it('sends priority and due date when creating a task', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ id: 1 }, 201))
    await createTask({ title: 'x', priority: 'high', due_date: '2026-12-31' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8000/tasks')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ title: 'x', priority: 'high', due_date: '2026-12-31' })
  })

  it('can clear the due date when updating a task', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ id: 1 }))
    await updateTask(1, { priority: 'low', due_date: null })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8000/tasks/1')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ priority: 'low', due_date: null })
  })
})
