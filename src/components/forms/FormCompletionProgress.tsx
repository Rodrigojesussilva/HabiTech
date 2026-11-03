import { z } from "zod"

type FieldCounts = {
  filled: number
  total: number
}

const excludedFields = new Set([
  "id",
  "idLocal",
  "arrolamento_id",
  "selagem_id",
  "residencial_id",
  "questionario",
  "interviewerName",
  "firstVisitStart",
  "interviewDate",
  "startTime",
  "endTime",
  "timeElapsed",
  "visitDurationHours",
  "visitNumber",
  "numberFamilies",
  "cadastrador",
])

function isFilled(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return Number.isFinite(value) && value > 0
  if (typeof value === "boolean") return value
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

function getFieldCounts(schema: z.ZodTypeAny, value: unknown): FieldCounts {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getFieldCounts(schema.unwrap(), value)
  }
  if (schema instanceof z.ZodCatch) {
    return getFieldCounts(schema._def.innerType, value)
  }
  if (schema instanceof z.ZodDefault) {
    return getFieldCounts(schema.removeDefault(), value)
  }
  if (schema instanceof z.ZodEffects) {
    return getFieldCounts(schema.innerType(), value)
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    return (Object.entries(shape) as Array<[string, z.ZodTypeAny]>).reduce<FieldCounts>((counts, [key, fieldSchema]) => {
      if (excludedFields.has(key)) return counts
      const fieldValue = typeof value === "object" && value !== null
        ? (value as Record<string, unknown>)[key]
        : undefined
      const fieldCounts = getFieldCounts(fieldSchema, fieldValue)
      return {
        filled: counts.filled + fieldCounts.filled,
        total: counts.total + fieldCounts.total,
      }
    }, { filled: 0, total: 0 })
  }
  if (schema instanceof z.ZodArray) {
    if (schema.element instanceof z.ZodObject) {
      const entries = Array.isArray(value) && value.length > 0 ? value : [{}]
      return entries.reduce<FieldCounts>((counts, entry) => {
        const fieldCounts = getFieldCounts(schema.element, entry)
        return {
          filled: counts.filled + fieldCounts.filled,
          total: counts.total + fieldCounts.total,
        }
      }, { filled: 0, total: 0 })
    }
    return { filled: isFilled(value) ? 1 : 0, total: 1 }
  }

  return { filled: isFilled(value) ? 1 : 0, total: 1 }
}

export default function FormCompletionProgress({
  schema,
  values,
}: {
  schema: z.ZodTypeAny
  values: unknown
}) {
  const { filled, total } = getFieldCounts(schema, values)
  const completion = total === 0 ? 0 : Math.round((filled / total) * 100)

  return <ProgressMeter completion={completion} />
}

export function ProgressMeter({ completion }: { completion: number }) {
  return (
    <div className="min-w-36 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">Preenchimento</span>
        <strong>{completion}%</strong>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-label="Percentual de preenchimento"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completion}
        aria-valuetext={`${completion}% preenchido`}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width]"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  )
}
