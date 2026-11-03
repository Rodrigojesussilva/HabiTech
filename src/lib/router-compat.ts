import { useRouter, useRouterState } from "@tanstack/react-router"

export function useNavigate() {
  const router = useRouter()
  return (to: string) => router.history.push(to)
}

export function useLocation() {
  return useRouterState({ select: (state) => state.location })
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const params = useRouterState({
    select: (state) => state.matches[state.matches.length - 1]?.params ?? {},
  })
  return params as T
}
