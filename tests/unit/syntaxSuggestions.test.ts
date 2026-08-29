import { describe, expect, it } from 'vitest'
import {
  applySuggestion,
  buildSyntaxCorpus,
  getSuggestions,
  getTokenAt,
} from '../../src/services/syntaxSuggestions'
import type { Question } from '../../src/types/question'

const sample: Question[] = [
  {
    id: '1',
    category: 'Dataverse — Plug-in',
    topic: 'ctx',
    origin: 'GAP',
    prompt: 'p',
    answer: 'IPluginExecutionContext',
    acceptedAnswers: ['IPluginExecutionContext'],
    gradeMode: 'exact',
  },
  {
    id: '2',
    category: 'Dataverse — Plug-in',
    topic: 'svc',
    origin: 'GAP',
    prompt: 'p',
    answer: 'IOrganizationService',
    acceptedAnswers: ['IOrganizationService'],
    gradeMode: 'exact',
  },
  {
    id: '3',
    category: 'Dataverse — Plug-in',
    topic: 'fac',
    origin: 'GAP',
    prompt: 'p',
    answer: 'IOrganizationServiceFactory',
    acceptedAnswers: ['IOrganizationServiceFactory'],
    gradeMode: 'exact',
  },
  {
    id: '4',
    category: 'Power Fx',
    topic: 'Filter',
    origin: 'GAP',
    prompt: 'p',
    answer: 'Filter(Accounts, Status = "Active")',
    acceptedAnswers: ['Filter(Accounts, Status = "Active")'],
    gradeMode: 'exact',
  },
]

describe('syntaxSuggestions', () => {
  const corpus = buildSyntaxCorpus(sample)

  it('includes answers and extracted identifiers', () => {
    expect(corpus).toContain('IPluginExecutionContext')
    expect(corpus).toContain('Filter')
    expect(corpus).toContain('Accounts')
  })

  it('narrows on prefix and expands when query shortens', () => {
    const narrow = getSuggestions('IPl', 3, 8, corpus)
    expect(narrow).toContain('IPluginExecutionContext')
    expect(narrow.every((s) => s.toLowerCase().startsWith('ipl'))).toBe(true)

    const wider = getSuggestions('I', 1, 8, corpus)
    expect(wider.length).toBeGreaterThanOrEqual(narrow.length)
    expect(wider).toEqual(
      expect.arrayContaining(['IPluginExecutionContext', 'IOrganizationService']),
    )
  })

  it('is case-insensitive', () => {
    const lower = getSuggestions('iplugin', 7, 8, corpus)
    expect(lower[0]).toBe('IPluginExecutionContext')
  })

  it('returns empty when there is no token', () => {
    expect(getSuggestions('', 0, 8, corpus)).toEqual([])
    expect(getSuggestions('Filter( ', 8, 8, corpus)).toEqual([])
  })

  it('getTokenAt finds the token under the caret', () => {
    expect(getTokenAt('var x = IPlugin', 14)).toEqual({
      token: 'IPlugin',
      start: 8,
      end: 15,
    })
  })

  it('applySuggestion replaces only the current token', () => {
    const next = applySuggestion('Get IPlugin', 11, 'IPluginExecutionContext')
    expect(next.value).toBe('Get IPluginExecutionContext')
    expect(next.caret).toBe('Get IPluginExecutionContext'.length)
  })
})
