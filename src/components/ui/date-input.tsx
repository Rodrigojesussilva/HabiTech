import * as React from "react"
import { Input } from "@/components/ui/input"
import { parse, isValid, format } from "date-fns"

interface DateInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "type"> {
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

function isoToBr(iso?: string): string {
  if (!iso) return ""
  const m = /^\d{4}-\d{2}-\d{2}$/.exec(iso)
  if (!m) return ""
  const [y, mo, d] = iso.split("-")
  return `${d}/${mo}/${y}`
}

function brToIso(display?: string): string {
  if (!display) return ""
  const cleaned = display.replace(/[^0-9/]/g, "")
  if (cleaned.length !== 10) return ""
  const parsed = parse(cleaned, "dd/MM/yyyy", new Date())
  if (!isValid(parsed)) return ""
  return format(parsed, "yyyy-MM-dd")
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ name, value, onChange, placeholder = "DD/MM/AAAA", disabled, className, ...rest }, ref) => {
    const [display, setDisplay] = React.useState<string>(isoToBr(value))
    const lastIsoRef = React.useRef<string>(value || "")

    React.useEffect(() => {
      // Keep display in sync when external value changes
      const nextIso = value || ""
      if (nextIso !== lastIsoRef.current) {
        lastIsoRef.current = nextIso
        setDisplay(isoToBr(nextIso))
      }
    }, [value])

    const formatAsUserTypes = (raw: string) => {
      const digits = raw.replace(/\D/g, "").slice(0, 8)
      const p1 = digits.slice(0, 2)
      const p2 = digits.slice(2, 4)
      const p3 = digits.slice(4, 8)
      let out = p1
      if (p2) out += "/" + p2
      if (p3) out += "/" + p3
      return out
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextDisplay = formatAsUserTypes(e.target.value)
      setDisplay(nextDisplay)

      if (nextDisplay.length === 10) {
        const iso = brToIso(nextDisplay)
        if (iso) {
          lastIsoRef.current = iso
          onChange && onChange(iso)
        }
      } else if (nextDisplay === "") {
        lastIsoRef.current = ""
        onChange && onChange("")
      }
    }

    const handleBlur = () => {
      if (display === "") return
      if (display.length !== 10) {
        // Incomplete: revert to last valid value
        setDisplay(isoToBr(lastIsoRef.current))
        return
      }
      const iso = brToIso(display)
      if (!iso) {
        // Invalid: revert to last valid value
        setDisplay(isoToBr(lastIsoRef.current))
        return
      }
      if (iso !== lastIsoRef.current) {
        lastIsoRef.current = iso
        onChange && onChange(iso)
      }
      // normalize display in case user typed variant
      setDisplay(isoToBr(iso))
    }

    return (
      <Input
        ref={ref}
        name={name}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        disabled={disabled}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className || "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"}
        {...rest}
      />
    )
  }
)
DateInput.displayName = "DateInput"

export default DateInput 