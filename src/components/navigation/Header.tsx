import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { useNavigate } from "@/lib/router-compat"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Check, CirclePlus, ImagePlus, LogOut } from "lucide-react"
import { demoApi } from "@/service/demo.api"
import { isBackendApiConfigured } from "@/service/backend.api"

interface HeaderProps {
  children?: ReactNode
}

type UserProfile = {
  name: string
  avatar: string
}

const PROFILE_NAME_KEY = "userName"
const PROFILE_AVATAR_KEY = "userAvatar"

function getDefaultName(email: string | null) {
  if (!email) return "Usuário da demonstração"
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("pt-BR"))
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("pt-BR") ?? "")
    .join("") || "US"
}

function readResizedAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("O arquivo selecionado não é uma imagem válida."))
      image.onload = () => {
        const canvas = document.createElement("canvas")
        const scale = Math.min(1, 256 / Math.max(image.naturalWidth, image.naturalHeight))
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
        const context = canvas.getContext("2d")
        if (!context) {
          reject(new Error("Não foi possível preparar a imagem."))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(() => ({
    name: localStorage.getItem(PROFILE_NAME_KEY) || getDefaultName(localStorage.getItem("userEmail")),
    avatar: localStorage.getItem(PROFILE_AVATAR_KEY) || "",
  }))
  const [draftName, setDraftName] = useState(profile.name)
  const [draftAvatar, setDraftAvatar] = useState(profile.avatar)
  const [profileError, setProfileError] = useState("")
  const [isReadingAvatar, setIsReadingAvatar] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"syncing" | "synced" | "offline" | "error">(
    () => navigator.onLine ? "syncing" : "offline",
  )
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const demoStatus = useQuery({
    queryKey: ["demo-status"],
    queryFn: async () => {
      const { data } = await demoApi.get<{ mode: string }>("/demo/status")
      return data
    },
  })

  useEffect(() => {
    if (!isBackendApiConfigured) return

    const handleSyncStatus = (event: Event) => {
      const status = (event as CustomEvent<{ status: typeof syncStatus }>).detail.status
      setSyncStatus(status)
    }
    const handleOffline = () => setSyncStatus("offline")
    const handleOnline = () => setSyncStatus("syncing")

    window.addEventListener("habitech-sync-status", handleSyncStatus)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("habitech-sync-status", handleSyncStatus)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const formOptions = [
    { name: "Selagem", path: "/create-selagem" },
    { name: "Arrolamento", path: "/create-arrolamento" },
    { name: "Residencial", path: "/create-residencial" },
    { name: "Não Residencial", path: "/create-nao-residencial" },
    { name: "Ocupação Predial", path: "/create-ocupacao-predial" },
  ]

  const navigateToForm = (formPath: string) => {
    navigate(formPath)
    setIsMenuOpen(false)
  }

  const toggleProfile = () => {
    if (!isProfileOpen) {
      setDraftName(profile.name)
      setDraftAvatar(profile.avatar)
      setProfileError("")
    }
    setIsProfileOpen((isOpen) => !isOpen)
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setProfileError("Selecione um arquivo de imagem.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError("A imagem deve ter no máximo 5 MB.")
      return
    }

    setIsReadingAvatar(true)
    setProfileError("")
    try {
      setDraftAvatar(await readResizedAvatar(file))
    } catch (error) {
      console.error("Erro ao preparar o avatar:", error)
      setProfileError(error instanceof Error ? error.message : "Não foi possível carregar a imagem.")
    } finally {
      setIsReadingAvatar(false)
    }
  }

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = draftName.trim()
    if (!name) {
      setProfileError("Informe o nome que será exibido.")
      return
    }

    try {
      localStorage.setItem(PROFILE_NAME_KEY, name)
      if (draftAvatar) localStorage.setItem(PROFILE_AVATAR_KEY, draftAvatar)
      else localStorage.removeItem(PROFILE_AVATAR_KEY)
      setProfile({ name, avatar: draftAvatar })
      setProfileError("")
      setIsProfileOpen(false)
    } catch (error) {
      console.error("Erro ao salvar o perfil local:", error)
      setProfileError("Não foi possível salvar o perfil neste navegador.")
    }
  }

  const logOut = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("authToken")
    localStorage.removeItem("authTokenExpiresAt")
    window.location.href = "/login"
  }

  return (
    <>
      <header className="app-fixed-header fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="app-header-layout mx-auto grid h-full max-w-[1400px] items-center gap-x-2 px-3 pb-1 md:gap-4 md:px-5 md:pb-0">
          <div className="app-header-logo-wrap flex min-w-0 items-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              title="Ir para página inicial"
            >
              <Building2 className="size-5 shrink-0 text-blue-700 sm:size-6" aria-hidden="true" />
              <span className="truncate text-xs font-bold text-slate-900 sm:text-sm">HabiTech</span>
            </button>
          </div>

          <div className="app-header-brand flex min-w-0 items-center justify-center gap-1.5 pb-1 md:gap-3 md:pb-0">
            <span className="flex h-8 shrink-0 items-end gap-px rounded-md bg-blue-50 px-1.5 py-1 sm:h-10 sm:gap-1 sm:rounded-lg sm:px-2 sm:py-1.5" aria-hidden="true">
              <span className="h-2 w-0.5 rounded-sm bg-orange-500 sm:w-1.5" />
              <span className="h-3 w-0.5 rounded-sm bg-blue-500 sm:h-3.5 sm:w-1.5" />
              <span className="h-4 w-0.5 rounded-sm bg-blue-800 sm:h-5 sm:w-1.5" />
              <span className="ml-0.5 h-4 w-px bg-slate-300 sm:ml-1 sm:h-5" />
              <span className="h-2.5 w-0.5 rounded-sm bg-cyan-500 sm:h-3 sm:w-1.5" />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate text-[9px] font-extrabold uppercase tracking-[0.04em] text-slate-900 sm:text-sm sm:tracking-[0.14em]">
                  Instrumentos
              </span>
              <span className="mt-1 flex items-center gap-1.5">
                <span className="block h-px w-2 shrink-0 bg-orange-500 sm:w-5" />
                <span className="truncate text-[8px] font-semibold uppercase tracking-[0.1em] text-blue-700 sm:text-[10px] sm:tracking-[0.2em]">
                    Pesquisa
                </span>
              </span>
            </span>
          </div>

          <div className="app-header-actions flex min-w-0 items-center justify-end gap-1.5 md:gap-3">
            <span
              className={`hidden rounded-full border px-2.5 py-1 text-xs font-medium lg:inline-flex ${
                !isBackendApiConfigured || syncStatus === "synced"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : syncStatus === "error"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
              role="status"
              title={isBackendApiConfigured
                ? syncStatus === "offline"
                  ? "Sem internet; alterações continuam salvas neste dispositivo."
                  : syncStatus === "error"
                    ? "Falha na sincronização; os registros continuam salvos neste dispositivo."
                    : syncStatus === "syncing"
                      ? "Sincronizando registros com o servidor."
                      : "Registros sincronizados com o servidor."
                : demoStatus.isError
                  ? "Não foi possível verificar o modo de demonstração"
                  : "Dados locais demonstrativos"}
            >
              {!isBackendApiConfigured
                ? demoStatus.isError ? "Modo indisponível" : "Demonstração"
                : syncStatus === "offline"
                  ? "Offline • local"
                  : syncStatus === "error"
                    ? "Sincronização pendente"
                    : syncStatus === "syncing"
                      ? "Sincronizando"
                      : "Sincronizado"}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen((isOpen) => !isOpen)
                  setIsProfileOpen(false)
                }}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Novo formulário"
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-700 px-3 text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/25 sm:px-4"
              >
                <CirclePlus className="size-4" aria-hidden />
                <span className="hidden text-sm font-semibold md:inline">Novo formulário</span>
              </button>
              {isMenuOpen && (
                <div
                  className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                  role="menu"
                  aria-label="Criar novo formulário"
                >
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Escolha um instrumento
                  </p>
                  {formOptions.map((form) => (
                    <button
                      type="button"
                      key={form.path}
                      role="menuitem"
                      onClick={() => navigateToForm(form.path)}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={toggleProfile}
                aria-expanded={isProfileOpen}
                aria-haspopup="dialog"
                aria-label={`Perfil de ${profile.name}`}
                className="flex items-center gap-2 rounded-full p-1 pr-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Avatar className="size-8 border border-slate-200">
                  <AvatarImage src={profile.avatar || undefined} alt="" />
                  <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-20 truncate text-[11px] font-medium text-slate-700 min-[360px]:inline sm:max-w-28 sm:text-xs lg:max-w-36 lg:text-sm">
                  {profile.name}
                </span>
              </button>
              {isProfileOpen && (
                <form
                  onSubmit={saveProfile}
                  className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl"
                  aria-label="Editar perfil do usuário"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar className="size-12 border border-slate-200">
                      <AvatarImage src={draftAvatar || undefined} alt="" />
                      <AvatarFallback>{getInitials(draftName || profile.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{profile.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {localStorage.getItem("userEmail") || "Conta demonstrativa"}
                      </p>
                    </div>
                  </div>
                  <label htmlFor="profile-display-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nome exibido
                  </label>
                  <input
                    id="profile-display-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    maxLength={60}
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
                  />
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isReadingAvatar}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <ImagePlus className="size-4" aria-hidden />
                    {isReadingAvatar ? "Carregando imagem..." : "Alterar avatar"}
                  </button>
                  {profileError && (
                    <p className="mt-2 text-sm text-red-700" role="alert">{profileError}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false)
                        setProfileError("")
                      }}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isReadingAvatar}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                    >
                      <Check className="size-4" aria-hidden />
                      Salvar perfil
                    </button>
                  </div>
                </form>
              )}
            </div>

            <button
              type="button"
              onClick={logOut}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <div className="app-fixed-header-spacer shrink-0" aria-hidden="true" />
      {children}
    </>
  )
}
