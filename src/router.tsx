import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router"
import App from "./App"
import Home from "./app/home"
import { ChartAreaInteractive } from "./app/dashboard/dash"
import FormularioContainer from "./components/formController/FormController"
import FormArrolamento from "./components/forms/arrolamento/FormArrolamento"
import FormSelagem from "./components/forms/selagem/FormSelagem"
import FormResidencial from "./components/forms/residencial/FormResidencial"
import DemoInstrumentForm from "./components/forms/demo/DemoInstrumentForm"
import { naoResidencialInstrument, ocupacaoPredialInstrument } from "./components/forms/demo/instruments"
import DemoInstrumentList from "./components/formDataTables/demo/DemoInstrumentList"
import ArrolamentoList from "./components/formDataTables/arrolamento/list"
import SelagemList from "./components/formDataTables/selagem/list"
import ThemeEditor from "./components/theme-editor"

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <main className="p-8">Página não encontrada.</main>,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: Home,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "home",
  component: Home,
})

const createArrolamentoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-arrolamento",
  component: () => <FormularioContainer FormComponent={FormArrolamento} />,
})

const createSelagemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-selagem",
  component: () => <FormularioContainer FormComponent={FormSelagem} />,
})

const createResidencialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-residencial",
  component: () => <FormularioContainer FormComponent={FormResidencial} />,
})

const createNaoResidencialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-nao-residencial",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={naoResidencialInstrument} />} openModalOnMount={false} />,
})

const createOcupacaoPredialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "create-ocupacao-predial",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={ocupacaoPredialInstrument} />} openModalOnMount={false} />,
})

const editNaoResidencialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "edit-nao-residencial/$id",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={naoResidencialInstrument} />} openModalOnMount={false} />,
})

const viewNaoResidencialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "view-nao-residencial/$id",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={naoResidencialInstrument} viewMode />} openModalOnMount={false} />,
})

const editOcupacaoPredialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "edit-ocupacao-predial/$id",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={ocupacaoPredialInstrument} />} openModalOnMount={false} />,
})

const viewOcupacaoPredialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "view-ocupacao-predial/$id",
  component: () => <FormularioContainer FormComponent={(props) => <DemoInstrumentForm {...props} definition={ocupacaoPredialInstrument} viewMode />} openModalOnMount={false} />,
})

const editSelagemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "edit-selagem/$id",
  component: () => <FormularioContainer FormComponent={FormSelagem} openModalOnMount={false} />,
})

const viewSelagemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "view-selagem/$id",
  component: () => <FormularioContainer FormComponent={FormSelagem} openModalOnMount={false} viewMode />,
})

const editArrolamentoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "edit-arrolamento/$id",
  component: () => <FormularioContainer FormComponent={FormArrolamento} openModalOnMount={false} />,
})

const viewArrolamentoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "view-arrolamento/$id",
  component: () => <FormularioContainer FormComponent={FormArrolamento} openModalOnMount={false} viewMode />,
})

const themeEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "theme-editor",
  component: ThemeEditor,
})

const arrolamentosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "lista-arrolamentos",
  component: ArrolamentoList,
})

const selagensRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "lista-selagens",
  component: SelagemList,
})

const residenciaisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "lista-residenciais",
  component: () => <DemoInstrumentList instrument="residencial" title="Residencial" />,
})

const naoResidenciaisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "lista-nao-residenciais",
  component: () => <DemoInstrumentList instrument="nao-residencial" title="Não Residencial" />,
})

const ocupacoesPrediaisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "lista-ocupacao-predial",
  component: () => <DemoInstrumentList instrument="ocupacao-predial" title="Ocupação Predial" />,
})

const chartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "chart",
  component: ChartAreaInteractive,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  homeRoute,
  createArrolamentoRoute,
  createSelagemRoute,
  createResidencialRoute,
  createNaoResidencialRoute,
  createOcupacaoPredialRoute,
  editNaoResidencialRoute,
  viewNaoResidencialRoute,
  editOcupacaoPredialRoute,
  viewOcupacaoPredialRoute,
  editSelagemRoute,
  viewSelagemRoute,
  editArrolamentoRoute,
  viewArrolamentoRoute,
  themeEditorRoute,
  arrolamentosRoute,
  selagensRoute,
  residenciaisRoute,
  naoResidenciaisRoute,
  ocupacoesPrediaisRoute,
  chartRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
