import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Housing demand data by region
const chartData = [
  { date: "2024-01", northRegion: 220, southRegion: 150, centralRegion: 180 },
  { date: "2024-02", northRegion: 197, southRegion: 180, centralRegion: 195 },
  { date: "2024-03", northRegion: 167, southRegion: 120, centralRegion: 145 },
  { date: "2024-04", northRegion: 242, southRegion: 260, centralRegion: 210 },
  { date: "2024-05", northRegion: 373, southRegion: 290, centralRegion: 320 },
  { date: "2024-06", northRegion: 301, southRegion: 340, centralRegion: 280 },
  { date: "2024-07", northRegion: 245, southRegion: 180, centralRegion: 230 },
  { date: "2024-08", northRegion: 409, southRegion: 320, centralRegion: 360 },
  { date: "2024-09", northRegion: 359, southRegion: 310, centralRegion: 290 },
  { date: "2024-10", northRegion: 261, southRegion: 190, centralRegion: 220 },
  { date: "2024-11", northRegion: 327, southRegion: 350, centralRegion: 260 },
  { date: "2024-12", northRegion: 292, southRegion: 210, centralRegion: 240 },
]

// Housing allocation criteria data
const priorityData = [
  { criteria: "Baixa Renda", score: 245 },
  { criteria: "Vulnerabilidade", score: 320 },
  { criteria: "Idosos", score: 186 },
  { criteria: "PCD", score: 152 },
  { criteria: "Risco Ambiental", score: 310 },
  { criteria: "Desabrigados", score: 275 },
]

// Housing supply data
const supplyData = [
  { project: "Jardim Esperança", complete: 85, planned: 100 },
  { project: "Nova Vida", complete: 120, planned: 150 },
  { project: "Bela Vista", complete: 45, planned: 200 },
  { project: "Boa Morada", complete: 180, planned: 180 },
  { project: "Sol Nascente", complete: 70, planned: 120 },
  { project: "Recanto Feliz", complete: 30, planned: 250 },
]

// Distribution of housing demand by vulnerability type
const vulnerabilityData = [
  { name: "Baixa Renda", value: 35 },
  { name: "Vulnerabilidade", value: 25 },
  { name: "Idosos", value: 15 },
  { name: "PCD", value: 10 },
  { name: "Risco Ambiental", value: 10 },
  { name: "Desabrigados", value: 5 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

const chartConfig = {
  housing: {
    label: "Famílias Cadastradas",
  },
  northRegion: {
    label: "Região Norte",
    color: "hsl(var(--chart-1))",
  },
  southRegion: {
    label: "Região Sul",
    color: "hsl(var(--chart-2))",
  },
  centralRegion: {
    label: "Região Central",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const priorityChartConfig = {
  criteria: {
    label: "Critério",
  },
  score: {
    label: "Pontuação",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const supplyChartConfig = {
  project: {
    label: "Projeto",
  },
  complete: {
    label: "Unidades Concluídas",
    color: "hsl(var(--chart-5))",
  },
  planned: {
    label: "Unidades Planejadas",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

const vulnerabilityChartConfig = {
  name: {
    label: "Tipo de Vulnerabilidade",
  },
  value: {
    label: "Percentual",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("12m")
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("6m")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-12-01")
    let monthsToSubtract = 12
    if (timeRange === "6m") {
      monthsToSubtract = 6
    } else if (timeRange === "3m") {
      monthsToSubtract = 3
    }
    const startDate = new Date(referenceDate)
    startDate.setMonth(startDate.getMonth() - monthsToSubtract)
    return date >= startDate
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardTitle>Demanda Habitacional</CardTitle>
            <CardDescription>
              <span className="@[540px]/card:block hidden">
                Famílias cadastradas por região nos últimos 12 meses
              </span>
              <span className="@[540px]/card:hidden">Últimos 12 meses</span>
            </CardDescription>
            <div className="absolute right-4 top-4">
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="@[767px]/card:flex hidden"
              >
                <ToggleGroupItem value="12m" className="h-8 px-2.5">
                  12 meses
                </ToggleGroupItem>
                <ToggleGroupItem value="6m" className="h-8 px-2.5">
                  6 meses
                </ToggleGroupItem>
                <ToggleGroupItem value="3m" className="h-8 px-2.5">
                  3 meses
                </ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="@[767px]/card:hidden flex w-40"
                  aria-label="Selecione um período"
                >
                  <SelectValue placeholder="Últimos 12 meses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="12m" className="rounded-lg">
                    Últimos 12 meses
                  </SelectItem>
                  <SelectItem value="6m" className="rounded-lg">
                    Últimos 6 meses
                  </SelectItem>
                  <SelectItem value="3m" className="rounded-lg">
                    Últimos 3 meses
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillNorth" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-northRegion)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-northRegion)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillSouth" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-southRegion)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-southRegion)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillCentral" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-centralRegion)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-centralRegion)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="centralRegion"
                  type="natural"
                  fill="url(#fillCentral)"
                  stroke="var(--color-centralRegion)"
                  stackId="a"
                />
                <Area
                  dataKey="southRegion"
                  type="natural"
                  fill="url(#fillSouth)"
                  stroke="var(--color-southRegion)"
                  stackId="a"
                />
                <Area
                  dataKey="northRegion"
                  type="natural"
                  fill="url(#fillNorth)"
                  stroke="var(--color-northRegion)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Critérios de Ranqueamento</CardTitle>
            <CardDescription>
              Pontuação de prioridade por tipo de vulnerabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={priorityChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart data={priorityData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="criteria"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                    />
                  }
                />
                <Bar
                  dataKey="score"
                  fill="var(--color-score)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Oferta de Moradias</CardTitle>
            <CardDescription>
              Unidades habitacionais por empreendimento (concluídas vs. planejadas)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={supplyChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart data={supplyData} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis 
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  dataKey="project"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={110}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="complete" fill="var(--color-complete)" stackId="a" />
                <Bar dataKey="planned" fill="var(--color-planned)" stackId="a" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Distribuição da Demanda</CardTitle>
            <CardDescription>
              Percentual de famílias por tipo de vulnerabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={vulnerabilityChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  align="right"
                  verticalAlign="middle"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [`${value}%`, name]}
                      indicator="dot"
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}