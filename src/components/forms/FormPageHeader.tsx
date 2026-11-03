import type { ReactNode } from "react"

type FormPageHeaderProps = {
  title: string
  description: string
  children?: ReactNode
  status?: ReactNode
}

export default function FormPageHeader({ title, description, children, status }: FormPageHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center">
      <div className="w-full">
        <p className="text-sm font-semibold tracking-wide text-blue-700">Instrumento de pesquisa demonstrativo</p>
        <h1 className="mt-2 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
          {status}
        </h1>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
      </div>
      {children && <div className="flex w-full justify-center">{children}</div>}
    </header>
  )
}
