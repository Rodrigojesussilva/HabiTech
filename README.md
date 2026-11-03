<p align="center">
  <img src="./public/habitech-wordmark.svg" alt="HabiTech — Pesquisa de Campo" width="320">
</p>

# Sistema de Gestão Habitacional (Projeto de Estudo)

Desenvolvimento full-stack de uma demo inspirada em sistemas públicos de habitação. Frontend focado em usabilidade e backend construído do zero. Utilização de dados fictícios para simulação de fluxos de trabalho.

## Tecnologias utilizadas

### Frontend

- React 19 e TypeScript
- Vite
- TanStack Router para navegação
- TanStack Query para estado e cache de consultas
- Axios para requisições HTTP
- Mock Service Worker (MSW) para simulação local da API
- Socket.IO Client, preparado para uso futuro e desconectado por padrão
- Tailwind CSS, Radix UI e componentes ShadCN
- React Hook Form e Zod para formulários e validação
- Lucide React e React Icons
- Recharts para gráficos

### Backend e dados

- C# e ASP.NET Core 10
- Entity Framework Core 10 e migrations
- Azure SQL como banco de dados configurável
- JWT (JSON Web Token) para autenticação
- OpenAPI para documentação da API
- ASP.NET Core Health Checks e Rate Limiting

### Testes e qualidade

- MSTest e ASP.NET Core TestServer
- Entity Framework Core InMemory para testes
- ESLint e TypeScript

## Executar localmente

```powershell
npm install
npm run dev
```

Sem `VITE_API_BASE_URL`, a aplicação usa o modo demonstrativo local com MSW. Acesso local: `demo@example.test` / `demo2025`. Os formulários Residencial, Não Residencial e Ocupação Predial salvam rascunhos no armazenamento deste navegador; Selagem e Arrolamento usam dados simulados em memória.

Para configurar a API e sincronizar registros, consulte [`backend/README.md`](./backend/README.md). O armazenamento local permite continuar trabalhando offline; a sincronização com a API é opcional. Atualmente, somente Residencial, Não Residencial e Ocupação Predial sincronizam; Selagem, Arrolamento e anexos ainda não fazem parte dessa integração.

## Publicar o frontend na Vercel

1. Importe este repositório na Vercel e mantenha a raiz do projeto como diretório raiz.
2. A configuração em [`vercel.json`](./vercel.json) define `npm run build`, a pasta `dist` e o fallback de rotas do TanStack Router.
3. Faça o deploy. Sem variáveis adicionais, o frontend usa o modo demonstrativo local com MSW.
4. Para conectar uma API publicada separadamente, configure `VITE_API_BASE_URL` nas variáveis de ambiente do projeto Vercel e faça um novo deploy. A API deve permitir requisições CORS vindas do domínio do frontend.

## Verificações

```powershell
npm run build
npm run lint
dotnet test backend\HabiTech.Api.Tests\HabiTech.Api.Tests.csproj
```

## Observações

- Azure SQL e sincronização com o backend exigem configuração própria; alertas de capacidade e custo ainda não estão configurados.
- O sistema não apaga registros automaticamente.
- Nenhuma licença de redistribuição foi definida neste repositório.
