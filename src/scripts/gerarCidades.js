import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

const demoCitiesByState = {
  SP: ["São Paulo", "Campinas", "Guarulhos", "Santos", "Osasco"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem"],
  PR: ["Curitiba", "Londrina", "Maringá"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
}

const citiesForOptions = Object.fromEntries(
  Object.entries(demoCitiesByState).map(([uf, cities]) => [
    uf,
    cities.map((city) => ({ label: city, value: city })),
  ]),
)

const output = `export const cidadesLocais = ${JSON.stringify(citiesForOptions, null, 2)};\n`
const outputPath = resolve("src/components/forms/selagem/estados.ts")

writeFileSync(outputPath, output, "utf8")
console.info(`Arquivo demonstrativo gerado em ${outputPath}`)
