/**
 * Unit tests for due date helpers.
 *
 * @author Alfie
 */

import { describe, expect, it } from 'vitest'
import { isOverdue, todayIso } from './taskDates'

describe('todayIso', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(todayIso(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(todayIso(new Date(2026, 10, 9, 0, 0))).toBe('2026-11-09')
  })
})

describe('isOverdue', () => {
  const today = '2026-11-09'

  it('is true when an open task is due before today', () => {
    expect(isOverdue({ status: 'todo', due_date: '2026-11-08' }, today)).toBe(true)
    expect(isOverdue({ status: 'doing', due_date: '2025-12-31' }, today)).toBe(true)
  })

  it('is false when the task is due today or later', () => {
    expect(isOverdue({ status: 'todo', due_date: today }, today)).toBe(false)
    expect(isOverdue({ status: 'todo', due_date: '2026-11-10' }, today)).toBe(false)
  })

  it('is false for done tasks and tasks without a due date', () => {
    expect(isOverdue({ status: 'done', due_date: '2026-11-01' }, today)).toBe(false)
    expect(isOverdue({ status: 'todo', due_date: null }, today)).toBe(false)
  })
})
