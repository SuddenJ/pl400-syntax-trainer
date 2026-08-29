/**
 * Parse PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md into structured questions.
 * Markdown is the source of truth — do not rewrite answers.
 */

const HEADING_RE = /^### ([A-Z0-9-]+) — (.+)\s*$/
const CATEGORY_RE = /^## (.+)\s*$/
const ORIGIN_RE = /\*\*Origin:\*\*\s*`?(DOC|GAP)`?/i
const PROMPT_RE = /\*\*Prompt:\*\*\s*([\s\S]*?)(?=\n\n\*\*|\n\n###|\n\n## |\n\n# |\s*$)/
const ANSWER_RE = /\*\*Answer:\*\*\s*([\s\S]*?)(?=\n\n\*\*|\n\n###|\n\n## |\n\n# |\s*$)/
const EXPLANATION_RE =
  /\*\*Explanation(?: \/ memory hook)?:\*\*\s*([\s\S]*?)(?=\n\n\*\*|\n\n###|\n\n## |\n\n# |\s*$)/

/**
 * @param {string} markdown
 * @returns {{ questions: object[], errors: string[] }}
 */
export function parseQuestionBank(markdown) {
  const errors = []

  if (!markdown.includes('# Question Bank')) {
    errors.push('Missing "# Question Bank" section')
    return { questions: [], errors }
  }
  if (!markdown.includes('# Answer Key')) {
    errors.push('Missing "# Answer Key" section')
    return { questions: [], errors }
  }

  const afterBank = markdown.split(/^# Question Bank\s*$/m)[1]
  if (!afterBank) {
    errors.push('Could not split Question Bank section')
    return { questions: [], errors }
  }

  const [questionSection, answerSectionRaw] = afterBank.split(/^# Answer Key\s*$/m)
  if (!answerSectionRaw) {
    errors.push('Could not split Answer Key section')
    return { questions: [], errors }
  }

  // Ignore trailing reference H1 sections after the answer key categories.
  const answerSection = answerSectionRaw.split(/^# (?!Answer Key)/m)[0]

  const questionsParsed = parseBlocks(questionSection, 'question')
  const answersParsed = parseBlocks(answerSection, 'answer')
  const questionsMap = questionsParsed.map
  const answersMap = answersParsed.map

  const questionIds = questionsParsed.order
  const answerIds = answersParsed.order

  const dupQuestions = findDuplicates(questionIds)
  const dupAnswers = findDuplicates(answerIds)
  for (const id of dupQuestions) errors.push(`Duplicate question ID: ${id}`)
  for (const id of dupAnswers) errors.push(`Duplicate answer-key ID: ${id}`)

  for (const id of new Set(answerIds)) {
    if (!questionsMap.has(id)) {
      errors.push(`Answer section contains unknown question ID: ${id}`)
    }
  }

  /** @type {object[]} */
  const questions = []

  for (const id of new Set(questionIds)) {
    const q = questionsMap.get(id)
    const a = answersMap.get(id)
    if (!a || !a.answer) {
      errors.push(`Question has no answer: ${id}`)
      continue
    }

    const answer = stripOuterBackticks(a.answer.trim())
    const explanation = a.explanation ? stripOuterBackticks(a.explanation.trim()) : undefined
    const origin = (q.origin || a.origin || 'GAP').toUpperCase()
    if (origin !== 'DOC' && origin !== 'GAP') {
      errors.push(`Invalid origin for ${id}: ${origin}`)
    }

    const gradeMode = inferGradeMode(answer)
    const acceptedAnswers = buildAcceptedAnswers(answer)

    questions.push({
      id,
      category: q.category,
      topic: q.topic,
      origin,
      prompt: q.prompt.trim(),
      answer,
      explanation,
      acceptedAnswers,
      gradeMode,
    })
  }

  return { questions, errors }
}

/**
 * @param {string} section
 * @param {'question'|'answer'} mode
 */
function parseBlocks(section, mode) {
  /** @type {Map<string, object>} */
  const map = new Map()
  /** @type {string[]} */
  const order = []
  let category = 'Uncategorized'
  const lines = section.split('\n')
  /** @type {string[]} */
  let buffer = []
  /** @type {{ id: string, topic: string } | null} */
  let current = null

  const flush = () => {
    if (!current) return
    const body = buffer.join('\n').trim()
    const originMatch = body.match(ORIGIN_RE)
    if (mode === 'question') {
      const promptMatch = body.match(PROMPT_RE)
      map.set(current.id, {
        id: current.id,
        topic: current.topic,
        category,
        origin: originMatch?.[1]?.toUpperCase(),
        prompt: promptMatch?.[1]?.trim() ?? '',
      })
    } else {
      const answerMatch = body.match(ANSWER_RE)
      const explanationMatch = body.match(EXPLANATION_RE)
      map.set(current.id, {
        id: current.id,
        topic: current.topic,
        category,
        origin: originMatch?.[1]?.toUpperCase(),
        answer: answerMatch?.[1]?.trim() ?? '',
        explanation: explanationMatch?.[1]?.trim(),
      })
    }
    buffer = []
    current = null
  }

  for (const line of lines) {
    const cat = line.match(CATEGORY_RE)
    if (cat && !cat[1].startsWith('Scope')) {
      flush()
      category = cat[1].trim()
      continue
    }
    const heading = line.match(HEADING_RE)
    if (heading) {
      flush()
      current = { id: heading[1], topic: heading[2].trim() }
      order.push(heading[1])
      buffer = []
      continue
    }
    if (current) buffer.push(line)
  }
  flush()
  return { map, order }
}

/** @param {string[]} ids */
function findDuplicates(ids) {
  const seen = new Set()
  const dups = new Set()
  for (const id of ids) {
    if (seen.has(id)) dups.add(id)
    seen.add(id)
  }
  return [...dups]
}

/** @param {string} value */
function stripOuterBackticks(value) {
  const trimmed = value.trim()
  if (trimmed.startsWith('`') && trimmed.endsWith('`') && trimmed.indexOf('`', 1) === trimmed.length - 1) {
    return trimmed.slice(1, -1)
  }
  // Multi-segment inline code like `foo` and `bar` — keep as-is without outer wrap only
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

/** @param {string} answer */
function inferGradeMode(answer) {
  const plain = answer.replace(/`/g, '').trim()
  if (plain.length > 80) return 'self'
  if (/\b(yes|no)\b/i.test(plain) && plain.length < 10) return 'exact'
  // Conceptual sentences without code tokens
  const looksLikeCode =
    /[.(){}[\];=<>]|I[A-Z][a-zA-Z]+|[A-Z][a-z]+[A-Z]|Filter|LookUp|Patch|Set\(|GetService|Xrm\.|executionContext|updateView|getOutputs|ServiceClient|SharedVariables/.test(
      plain,
    )
  if (!looksLikeCode && /\s/.test(plain) && plain.split(/\s+/).length > 6) return 'self'
  return 'exact'
}

/** @param {string} answer */
function buildAcceptedAnswers(answer) {
  const variants = new Set([answer])
  const noParens = answer.replace(/\(\s*\)$/u, '')
  if (noParens !== answer) variants.add(noParens)
  if (!answer.endsWith('()') && /^[A-Za-z_][A-Za-z0-9_.]*$/.test(answer)) {
    variants.add(`${answer}()`)
  }
  return [...variants]
}

/**
 * Validate parse result and throw/collect fatal errors.
 * @param {{ questions: object[], errors: string[] }} result
 */
export function assertValidQuestionBank(result) {
  if (result.errors.length > 0) {
    const err = new Error(`Question bank validation failed:\n- ${result.errors.join('\n- ')}`)
    err.errors = result.errors
    throw err
  }
  if (result.questions.length === 0) {
    throw new Error('Question bank produced zero questions')
  }
  return result.questions
}
