type SurveyRecord = { survey_id?: string }

const arrolamentoSequenceKey = 'habitech-mock-sequence:arrolamento'
const arrolamentosStorageKey = 'habitech-mock-records:v1:arrolamentos'
const selagemSequenceKey = 'habitech-mock-sequence:selagem'
const selagensStorageKey = 'habitech-mock-records:v1:selagens'
const residencialSequenceKey = 'habitech-mock-sequence:residencial'

/** Reserve a unique, readable ID for each new local Residencial record. */
export function createResidencialSurveyId(createdAt = new Date()): string {
  const year = createdAt.getFullYear()
  const sequenceKey = `${residencialSequenceKey}:${year}`
  let maxExisting = 0

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith('sehab-demo-records:v1:') || !key.endsWith(':residencial')) continue
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const record of parsed) {
        const surveyId = typeof record?.values?.questionario === 'string' ? record.values.questionario : ''
        const match = new RegExp(`^RES-${year}-(\\d+)$`, 'i').exec(surveyId)
        if (match) maxExisting = Math.max(maxExisting, Number(match[1]))
      }
    } catch {
      // Ignore malformed local data and continue allocating an ID.
    }
  }

  let sequence = Math.max(Number(localStorage.getItem(sequenceKey) || 0), maxExisting) + 1
  let surveyId = `RES-${year}-${String(sequence).padStart(3, '0')}`
  localStorage.setItem(sequenceKey, String(sequence))
  return surveyId
}

/** Reserve a unique, readable ID for a new local Arrolamento draft. */
export function createArrolamentoSurveyId(records: SurveyRecord[] = [], createdAt = new Date()): string {
  const year = createdAt.getFullYear()
  let storedRecords: SurveyRecord[] = []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(arrolamentosStorageKey) || '[]')
    if (Array.isArray(parsed)) storedRecords = parsed
  } catch {
    // Continue with the records provided by the caller.
  }

  const knownRecords = [...records, ...storedRecords]
  const matchingIds = knownRecords
    .map((record) => String(record?.survey_id || ''))
    .map((id) => new RegExp(`^ARR-${year}-(\\d+)$`, 'i').exec(id))
    .filter((match): match is RegExpExecArray => match !== null)
  const maxExisting = matchingIds.reduce((max, match) => Math.max(max, Number(match[1])), 0)

  let sequence = Math.max(Number(localStorage.getItem(`${arrolamentoSequenceKey}:${year}`) || 0), maxExisting) + 1
  let surveyId = `ARR-${year}-${String(sequence).padStart(3, '0')}`
  while (knownRecords.some((record) => String(record?.survey_id || '').toLowerCase() === surveyId.toLowerCase())) {
    sequence += 1
    surveyId = `ARR-${year}-${String(sequence).padStart(3, '0')}`
  }

  localStorage.setItem(`${arrolamentoSequenceKey}:${year}`, String(sequence))
  return surveyId
}

/** Reserve a unique, readable ID for a new local Selagem draft. */
export function createSelagemSurveyId(records: SurveyRecord[] = [], createdAt = new Date()): string {
  const year = createdAt.getFullYear()
  let storedRecords: SurveyRecord[] = []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(selagensStorageKey) || '[]')
    if (Array.isArray(parsed)) storedRecords = parsed
  } catch {
    // Continue with the records provided by the caller.
  }

  const knownRecords = [...records, ...storedRecords]
  const matchingIds = knownRecords
    .map((record) => String(record?.survey_id || ''))
    .map((id) => new RegExp(`^SEL-${year}-(\\d{1,8})$`, 'i').exec(id))
    .filter((match): match is RegExpExecArray => match !== null)
  const maxExisting = matchingIds.reduce((max, match) => Math.max(max, Number(match[1])), 0)

  let sequence = Math.max(Number(localStorage.getItem(`${selagemSequenceKey}:${year}`) || 0), maxExisting) + 1
  let surveyId = `SEL-${year}-${String(sequence).padStart(3, '0')}`
  while (knownRecords.some((record) => String(record?.survey_id || '').toLowerCase() === surveyId.toLowerCase())) {
    sequence += 1
    surveyId = `SEL-${year}-${String(sequence).padStart(3, '0')}`
  }

  localStorage.setItem(`${selagemSequenceKey}:${year}`, String(sequence))
  return surveyId
}
