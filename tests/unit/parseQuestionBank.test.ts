import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  assertValidQuestionBank,
  parseQuestionBank,
} from '../../scripts/lib/parseQuestionBank.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const bankPath = join(root, 'PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md')

describe('parseQuestionBank', () => {
  it('parses the full bank with matching IDs', () => {
    const md = readFileSync(bankPath, 'utf8')
    const result = parseQuestionBank(md)
    expect(result.errors).toEqual([])
    const questions = assertValidQuestionBank(result)
    expect(questions.length).toBe(260)
    expect(questions[0].id).toMatch(/^[A-Z0-9-]+$/)
    expect(questions.every((q) => q.answer.length > 0)).toBe(true)
  })

  it('detects duplicate IDs', () => {
    const md = `# Question Bank

## Cat

### DUP-001 — Topic

**Origin:** \`GAP\`

**Prompt:** One?

### DUP-001 — Topic again

**Origin:** \`GAP\`

**Prompt:** Two?

# Answer Key

## Cat

### DUP-001 — Topic

**Answer:** \`A\`

**Origin:** \`GAP\`
`
    const result = parseQuestionBank(md)
    expect(result.errors.some((e) => e.includes('Duplicate'))).toBe(true)
  })

  it('fails when a question has no answer', () => {
    const md = `# Question Bank

## Cat

### MISS-001 — Topic

**Origin:** \`GAP\`

**Prompt:** Missing answer?

# Answer Key

## Cat
`
    const result = parseQuestionBank(md)
    expect(result.errors.some((e) => e.includes('no answer'))).toBe(true)
  })

  it('fails on unknown answer-key ID', () => {
    const md = `# Question Bank

## Cat

### OK-001 — Topic

**Origin:** \`GAP\`

**Prompt:** Hi?

# Answer Key

## Cat

### OK-001 — Topic

**Answer:** \`A\`

### UNKNOWN-999 — Ghost

**Answer:** \`B\`
`
    const result = parseQuestionBank(md)
    expect(result.errors.some((e) => e.includes('unknown question ID'))).toBe(true)
  })

  it('matches question and answer by stable ID', () => {
    const md = `# Question Bank

## Cat

### ID-042 — SharedVariables

**Origin:** \`DOC\`

**Prompt:** Which collection?

# Answer Key

## Cat

### ID-042 — SharedVariables

**Answer:** \`SharedVariables\`

**Explanation / memory hook:** Pipeline handoff.

**Origin:** \`DOC\`
`
    const { questions, errors } = parseQuestionBank(md)
    expect(errors).toEqual([])
    expect(questions[0]).toMatchObject({
      id: 'ID-042',
      answer: 'SharedVariables',
      explanation: 'Pipeline handoff.',
      origin: 'DOC',
    })
  })
})
