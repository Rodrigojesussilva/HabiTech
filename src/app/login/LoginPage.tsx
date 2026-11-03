import type { Dispatch, SetStateAction } from "react"

import { LoginForm } from "@/app/login/LoginForm"

interface LoginPageProps {
  setIsLoginDone: Dispatch<SetStateAction<boolean>>
}

const LoginPage = ({ setIsLoginDone }: LoginPageProps) => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6">
    <div className="pointer-events-none absolute -left-24 -top-28 size-80 rounded-full bg-blue-200/50 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-orange-200/40 blur-3xl" />

    <section className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src="/psp.png"
              alt="Prefeitura de São Paulo — Habitação"
              className="mb-5 h-16 w-fit max-w-full object-contain sm:h-20"
            />
            <div className="mb-5 flex items-center justify-center gap-2.5">
              <span
                className="flex h-10 shrink-0 items-end gap-1 rounded-lg bg-blue-50 px-2 py-1.5"
                aria-hidden="true"
              >
                <span className="h-2 w-1.5 rounded-sm bg-orange-500" />
                <span className="h-3.5 w-1.5 rounded-sm bg-blue-500" />
                <span className="h-5 w-1.5 rounded-sm bg-blue-800" />
                <span className="ml-0.5 h-5 w-px bg-slate-300" />
                <span className="h-3 w-1.5 rounded-sm bg-cyan-500" />
              </span>
              <span className="text-left leading-none">
                <span className="block text-sm font-extrabold uppercase tracking-[0.14em] text-slate-900">
                  Instrumentos
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="block h-px w-5 shrink-0 bg-orange-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Pesquisa
                  </span>
                </span>
              </span>
            </div>
            <p className="text-sm font-semibold text-blue-700">Acesso à plataforma</p>
          </div>
          <LoginForm setIsLoginDone={setIsLoginDone} />
          <p className="mt-8 text-center text-xs text-slate-500">
            Ambiente demonstrativo • Dados armazenados localmente neste navegador
          </p>
        </div>
      </div>
    </section>
  </main>
)

export default LoginPage
