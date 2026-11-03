import type { AnchorHTMLAttributes, MouseEvent } from "react"
import { useRouter } from "@tanstack/react-router"

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, target, ...props }: LinkProps) {
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || target
    ) return

    event.preventDefault()
    router.history.push(to)
  }

  return <a href={to} target={target} onClick={handleClick} {...props} />
}
