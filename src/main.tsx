import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { initializeTheme } from "./lib/theme-utils"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

initializeTheme()

async function startApplication() {
  const { worker } = await import("./mocks/browser")
  await worker.start({
    onUnhandledRequest(request, print) {
      // A consulta de CEP sai diretamente do navegador e não usa a API local.
      const url = new URL(request.url)
      if (
        (url.hostname === "brasilapi.com.br" && url.pathname.startsWith("/api/cep/v1/"))
        || (url.hostname === "viacep.com.br" && url.pathname.endsWith("/json/"))
        || (url.origin === window.location.origin
          && (url.pathname === "/api/auth/login" || url.pathname === "/api/v1/sync/records"))
      ) return
      print.error()
    },
  })

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

void startApplication().catch((error: unknown) => {
  console.error("Não foi possível iniciar o modo de demonstração:", error)
  const root = document.getElementById("root")
  if (root) root.textContent = "Falha ao iniciar a demonstração. Consulte o console para detalhes."
})
