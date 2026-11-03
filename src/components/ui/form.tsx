import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { getDemoUser, saveAutosavedDemoRecord } from "@/lib/demo-form-records"

type AutoSaveDraft<TFieldValues extends FieldValues> = {
  version: 1
  updatedAt: string
  values: TFieldValues
}

function AutoSaveFormBridge() {
  const { getValues, reset, watch } = useFormContext()
  const [saved, setSaved] = React.useState(false)
  const [saveError, setSaveError] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  const draft = React.useRef<AutoSaveDraft<FieldValues> | null>(null)
  const restoring = React.useRef(false)
  const storageKey = React.useMemo(() => {
    const user = getDemoUser()
    const continuationId = new URLSearchParams(window.location.search).get("continuar")
    const draftPath = continuationId
      ? `${window.location.pathname}?continuar=${encodeURIComponent(continuationId)}`
      : window.location.pathname
    return `sehab-form-draft:v1:${user}:${draftPath}`
  }, [])

  React.useEffect(() => {
    try {
      const serializedDraft = localStorage.getItem(storageKey)
      if (serializedDraft) {
        const parsed: unknown = JSON.parse(serializedDraft)
        if (
          typeof parsed === "object"
          && parsed !== null
          && "version" in parsed
          && parsed.version === 1
          && "values" in parsed
          && typeof parsed.values === "object"
          && parsed.values !== null
        ) {
          draft.current = parsed as AutoSaveDraft<FieldValues>
          restoring.current = true
          reset(draft.current.values)
          queueMicrotask(() => {
            restoring.current = false
          })
        }
      }
    } catch (error) {
      console.error("Não foi possível restaurar o rascunho do formulário:", error)
      setSaveError(true)
    }

    const subscription = watch((values, metadata) => {
      if (!metadata.name && draft.current && !restoring.current) {
        restoring.current = true
        reset(values as FieldValues)
        const savedValues = draft.current.values
        reset({ ...(values as FieldValues), ...savedValues })
        draft.current = null
        queueMicrotask(() => {
          restoring.current = false
        })
      }
    })

    const saveDraft = () => {
      try {
        const values = getValues()
        const serialized = JSON.stringify(values, (_key, value: unknown) => {
          if (typeof File !== "undefined" && value instanceof File) return undefined
          if (typeof Blob !== "undefined" && value instanceof Blob) return undefined
          return value
        })
        const nextDraft: AutoSaveDraft<FieldValues> = {
          version: 1,
          updatedAt: new Date().toISOString(),
          values: JSON.parse(serialized) as FieldValues,
        }
        localStorage.setItem(storageKey, JSON.stringify(nextDraft))
        saveAutosavedDemoRecord(window.location.pathname, getDemoUser(), nextDraft.values)
        draft.current = nextDraft
        setSaveError(false)
        setSaved(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setSaved(false), 2200)
      } catch (error) {
        console.error("Não foi possível salvar automaticamente o formulário:", error)
        setSaved(false)
        setSaveError(true)
      }
    }

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.matches("input, textarea, select, [role='combobox'], [role='checkbox'], [role='radio']")) return
      if (target.matches(":disabled, [readonly], input[type='file']")) return
      if (target.closest("[data-autosave-ignore='true']")) return

      window.setTimeout(saveDraft, 0)
    }

    document.addEventListener("focusout", handleFocusOut, true)
    return () => {
      subscription.unsubscribe()
      document.removeEventListener("focusout", handleFocusOut, true)
      window.clearTimeout(timer.current)
    }
  }, [getValues, reset, storageKey, watch])

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100]">
      {saved && (
        <p className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow">
          Rascunho salvo automaticamente
        </p>
      )}
      {saveError && (
        <p className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 shadow" role="alert">
          Não foi possível salvar o rascunho neste navegador
        </p>
      )}
    </div>
  )
}

function Form<TFieldValues extends FieldValues>({
  children,
  ...methods
}: UseFormReturn<TFieldValues> & { children: React.ReactNode }) {
  return (
    <FormProvider {...methods}>
      {children}
      <AutoSaveFormBridge />
    </FormProvider>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
