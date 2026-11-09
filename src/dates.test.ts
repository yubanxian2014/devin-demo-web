/**
 * Unit tests for due-date helpers.
 *
 * @author Alfie
 */

import { describe, expect, it } from 'vitest'
import { formatDueDate, isOverdue, toIsoDate } from './dates'

describe('isOverdue', () => {
  const today = '2026-11-09'

  it('is true for an unfinished task due before today', () => {
    expect(isOverdue({ status: 'todo', due_date: '2026-11-08' }, today)).toBe(true)
    expect(isOverdue({ status: 'doing', due_date: '2025-01-01' }, today)).toBe(true)
  })

  it('is false on the due date itself and afterwards', () => {
    expect(isOverdue({ status: 'todo', due_date: '2026-11-09' }, today)).toBe(false)
    expect(isOverdue({ status: 'todo', due_date: '2026-11-10' }, today)).toBe(false)
  })

  it('is false for done tasks and tasks without a due date', () => {
    expect(isOverdue({ status: 'done', due_date: '2020-01-01' }, today)).toBe(false)
    expect(isOverdue({ status: 'todo', due_date: null }, today)).toBe(false)
  })
})

describe('toIsoDate', () => {
  it('uses the local calendar date', () => {
    expect(toIsoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})

describe('formatDueDate', () => {
  it('formats without shifting the day', () => {
    expect(formatDueDate('2026-12-01')).toBe('Dec 1, 2026')
  })
})
