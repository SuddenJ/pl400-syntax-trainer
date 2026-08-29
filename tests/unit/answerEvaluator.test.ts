import { describe, expect, it } from 'vitest'
import { evaluateAnswer } from '../../src/services/answerEvaluator'
import { normalizeAnswer } from '../../src/utils/normalize'

describe('normalizeAnswer', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeAnswer('  CountRows( Self.Selected.AllItems ) > 0  ')).toBe(
      normalizeAnswer('CountRows(Self.Selected.AllItems)>0'),
    )
  })

  it('strips trailing empty parens', () => {
    expect(normalizeAnswer('GetService()')).toBe(normalizeAnswer('GetService'))
  })

  it('is case-insensitive', () => {
    expect(normalizeAnswer('IPluginExecutionContext')).toBe(
      normalizeAnswer('ipluginexecutioncontext'),
    )
  })
})

describe('evaluateAnswer', () => {
  const base = {
    answer: 'IPluginExecutionContext',
    acceptedAnswers: ['IPluginExecutionContext'],
    gradeMode: 'exact' as const,
  }

  it('marks exact technical identifiers correct', () => {
    expect(evaluateAnswer('IPluginExecutionContext', base)).toBe('correct')
    expect(evaluateAnswer('ipluginexecutioncontext', base)).toBe('correct')
  })

  it('allows optional trailing ()', () => {
    expect(
      evaluateAnswer('GetService()', {
        answer: 'GetService',
        acceptedAnswers: ['GetService', 'GetService()'],
        gradeMode: 'exact',
      }),
    ).toBe('correct')
  })

  it('does not accept a different identifier', () => {
    expect(
      evaluateAnswer('IOrganizationServiceFactory', {
        answer: 'IOrganizationService',
        acceptedAnswers: ['IOrganizationService'],
        gradeMode: 'exact',
      }),
    ).toBe('incorrect')
  })

  it('returns close for self-grade questions', () => {
    expect(
      evaluateAnswer('something', {
        answer: 'A long conceptual explanation about delegation semantics in canvas apps.',
        acceptedAnswers: ['A long conceptual explanation about delegation semantics in canvas apps.'],
        gradeMode: 'self',
      }),
    ).toBe('close')
  })
})
