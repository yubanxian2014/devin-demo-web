/**
 * Tests for the API client query building.
 *
 * @author Alfie
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { listTasks } from './api'

describe('listTasks', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubFetch() {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response('[]', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  it('omits the query string without filters', async () => {
    const fetchMock = stubFetch()
    await listTasks()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/tasks$/)
  })

  it('sends status and priority filters', async () => {
    const fetchMock = stubFetch()
    await listTasks({ status: 'doing', priority: 'high' })
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/tasks\?status=doing&priority=high$/)
  })
})
