import { useCallback, useMemo, useState, type Ref } from "react"
import { useForm, type FieldErrors, type Resolver, type UseFormRegister } from "react-hook-form"
import { useNavigate, useParams } from "@/lib/router-compat"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Form } from "@/components/ui/form"
import FormPageHeader from "@/components/forms/FormPageHeader"
import { ProgressMeter } from "@/components/forms/FormCompletionProgress"
import {
  clearDemoInstrumentDraft,
  completeDemoInstrumentRecord,
  findDemoInstrumentRecord,
  getOrCreateActiveDemoRecordId,
  type DemoInstrumentRecord,
} from "@/lib/demo-form-records"
import type { DemoInstrumentDefinition, DemoInstrumentField } from "./instruments"

type FormValues = Record<string, string>
type InstrumentSection = DemoInstrumentDefinition["sections"][number]

type DemoInstrumentFormProps = {
  definition: DemoInstrumentDefinition
  ref?: Ref<HTMLDivElement>
  viewMode?: boolean
}

function getDefaultValues(definition: DemoInstrumentDefinition, record?: DemoInstrumentRecord): FormValues {
  const values: FormValues = {}
  for (const section of definition.sections) {
    for (const field of section.fields) {
      const value = record?.values[field.name]
      values[field.name] = typeof value === "string" ? value : ""
    }
  }
  return values
}

function InstrumentField({
  field,
  register,
  error,
  disabled,
}: {
  field: DemoInstrumentField
  register: UseFormRegister<FormValues>
  error?: string
  disabled: boolean
}) {
  const className = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
  const registration = register(field.name, { required: field.required ? `${field.label} é obrigatório.` : false })

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {field.label}{field.required && <span className="text-red-600"> *</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea
          {...registration}
          rows={4}
          className={className}
          disabled={disabled}
          aria-required={field.required || undefined}
        />
      ) : field.type === "select" ? (
        <select
          {...registration}
          className={className}
          disabled={disabled}
          aria-required={field.required || undefined}
        >
          <option value="">Selecione</option>
          {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          {...registration}
          type={field.type ?? "text"}
          min={field.type === "number" ? 0 : undefined}
          className={className}
          disabled={disabled}
          aria-required={field.required || undefined}
        />
      )}
      {error && <span className="block text-sm text-red-700" role="alert">{error}</span>}
    </label>
  )
}

function getSectionForField(sections: InstrumentSection[], fieldName: string): string | undefined {
  return sections.find((section) => section.fields.some((field) => field.name === fieldName))?.id
}

export default function DemoInstrumentForm({
  definition,
  ref,
  viewMode = false,
}: DemoInstrumentFormProps) {
  const { id: routeId } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const user = localStorage.getItem("userEmail") ?? "anonymous"
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [recordState] = useState(() => {
    try {
      const id = routeId ?? getOrCreateActiveDemoRecordId(definition.id, user)
      return { id, record: findDemoInstrumentRecord(definition.id, user, id), error: "" }
    } catch (error) {
      return {
        id: routeId ?? "",
        record: undefined,
        error: error instanceof Error ? error.message : "Não foi possível carregar o formulário demonstrativo.",
      }
    }
  })
  const isViewMode = viewMode
  const resolver = useCallback<Resolver<FormValues>>(async (values) => {
    const errors: FieldErrors<FormValues> = {}
    for (const section of definition.sections) {
      for (const field of section.fields) {
        if (field.required && !values[field.name]?.trim()) {
          errors[field.name] = { type: "required", message: `${field.label} é obrigatório.` }
        }
      }
    }
    return Object.keys(errors).length > 0 ? { values: {}, errors } : { values, errors }
  }, [definition.sections])
  const form = useForm<FormValues>({
    defaultValues: getDefaultValues(definition, recordState.record),
    resolver,
  })
  const values = form.watch()
  const completion = useMemo(() => {
    const allFields = definition.sections.flatMap((section) => section.fields)
    if (allFields.length === 0) return 0
    const completed = allFields.filter((field) => Boolean(values[field.name]?.trim())).length
    return Math.round((completed / allFields.length) * 100)
  }, [definition.sections, values])

  const handleComplete = form.handleSubmit((formValues) => {
    try {
      completeDemoInstrumentRecord(definition.id, user, recordState.id, formValues)
      clearDemoInstrumentDraft(user, window.location.pathname)
      navigate(definition.listPath)
    } catch (error) {
      console.error("Não foi possível concluir o formulário demonstrativo:", error)
      window.alert("Não foi possível concluir o formulário neste navegador. Verifique o espaço disponível e tente novamente.")
    }
  }, (errors) => {
    const firstInvalidField = Object.keys(errors)[0]
    const sectionId = firstInvalidField
      ? getSectionForField(definition.sections, firstInvalidField)
      : undefined
    if (sectionId) {
      setExpandedSections((sections) => sections.includes(sectionId) ? sections : [...sections, sectionId])
    }
  })

  if (recordState.error) {
    return <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{recordState.error}</p>
  }

  if (!recordState.id || (!recordState.record && routeId)) {
    return <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">Este registro demonstrativo não foi encontrado.</p>
  }

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-5xl space-y-6 p-2 text-left sm:p-4"
      nome-form={definition.title}
      descr-form={definition.description}
      data-family-index="0"
    >
      <Form {...form}>
        <form onSubmit={handleComplete} className="space-y-8">
          <FormPageHeader title={definition.title} description={definition.description}>
            <ProgressMeter completion={completion} />
          </FormPageHeader>

          {definition.sections.map((section, index) => {
            const isExpanded = expandedSections.includes(section.id)
            const requiredCount = section.fields.filter((field) => field.required).length
            return (
              <Collapsible
                key={section.id}
                open={isExpanded}
                onOpenChange={(open) => {
                  setExpandedSections((sections) =>
                    open
                      ? [...sections, section.id]
                      : sections.filter((sectionId) => sectionId !== section.id),
                  )
                }}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <CollapsibleTrigger
                  data-secao={section.id}
                  data-label={section.title}
                  className="section-header flex w-full items-center justify-between gap-4 bg-gray-100 px-4 py-4 text-left transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset sm:px-6"
                  aria-label={`Seção ${index + 1}: ${section.title}${isExpanded ? ", recolher" : ", expandir"}`}
                >
                  <span>
                    <span className="block font-semibold text-slate-900">
                      {`Seção ${index + 1} - ${section.title}`}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600">
                      {requiredCount > 0 ? `${requiredCount} campo(s) obrigatório(s)` : "Campos opcionais"}
                    </span>
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6"
                >
                  {section.fields.map((field) => (
                    <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <InstrumentField
                        field={field}
                        register={form.register}
                        error={form.formState.errors[field.name]?.message}
                        disabled={isViewMode}
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )
          })}

          <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(definition.listPath)}>
              Voltar para a lista
            </Button>
            {!isViewMode && (
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                Finalizar formulário
              </Button>
            )}
          </footer>
        </form>
      </Form>
    </div>
  )
}
