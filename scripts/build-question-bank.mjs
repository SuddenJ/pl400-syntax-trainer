#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertValidQuestionBank, parseQuestionBank } from './lib/parseQuestionBank.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourcePath = join(root, 'PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md')
const outPath = join(root, 'src', 'data', 'questions.generated.json')

const markdown = readFileSync(sourcePath, 'utf8')
const parsed = parseQuestionBank(markdown)

try {
  const questions = assertValidQuestionBank(parsed)
  mkdirSync(dirname(outPath), { recursive: true })
  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md',
    count: questions.length,
    questions,
  }
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${questions.length} questions → ${outPath}`)
} catch (err) {
  console.error(err.message || err)
  process.exit(1)
}
