<p align="center">
  <img src="./public/habitech-wordmark.svg" alt="HabiTech — Pesquisa de Campo" width="320">
</p>

# HabiTech — Sistema de Pesquisa Habitacional

Aplicação de demonstração para registrar e acompanhar pesquisas habitacionais. O projeto reúne um frontend React, uma API ASP.NET Core e armazenamento local com SQL Server. Os dados de demonstração são fictícios.

## O que o aplicativo faz

O painel apresenta os instrumentos de pesquisa, permite buscar e favoritar acessos e resume a quantidade de registros, rascunhos e formulários concluídos. O sistema oferece estes instrumentos:

- **Residencial:** dados do imóvel, responsável, moradores e infraestrutura residencial.
- **Não Residencial:** imóveis, atividades econômicas e ocupações não residenciais.
- **Ocupação Predial:** edificações, uso, ocupação e condições prediais.
- **Selagem:** identificação e caracterização de unidades e espaços habitados.
- **Arrolamento:** levantamento de famílias e condições de moradia.

Os formulários salvam rascunhos no navegador para permitir o trabalho local. Com a API disponível, os registros de Residencial, Não Residencial e Ocupação Predial sincronizam com o banco e podem ser retomados após a sincronização. Selagem, Arrolamento e anexos ainda usam dados simulados no frontend e não são persistidos pela API.

## Tecnologias

- **Frontend:** React 19, TypeScript, Vite, TanStack Router, TanStack Query, React Hook Form, Zod, Tailwind CSS e componentes Radix/ShadCN.
- **API:** C#, ASP.NET Core 10, Entity Framework Core, migrations, autenticação JWT, OpenAPI, health checks e limitação de tentativas de login.
- **Banco:** SQL Server com autenticação SQL. A API salva os registros sincronizados em `SyncedInstrumentRecords`; os valores específicos dos formulários são armazenados em JSON. As contas de demonstração são configuradas na API, não em uma tabela de usuários.
- **Modo demonstrativo:** Mock Service Worker (MSW) atende fluxos que ainda não estão conectados à API.

## Requisitos

- Node.js e npm
- .NET 10 SDK
- SQL Server (por exemplo, SQL Server Express) configurado com **Mixed Mode** / autenticação SQL
- SQL Server Management Studio (SSMS), para executar o script de criação do banco

## Criar o banco de dados

1. Inicie sua instância local do SQL Server e habilite a autenticação SQL (Mixed Mode).
2. Abra `database/sqlserver/create-database.sql` no SSMS e conecte-se à instância usando uma conta administradora.
3. Execute o script. Ele cria o banco `HabiTechLocal`, o login SQL `habitech_app`, o usuário do banco, a tabela de registros sincronizados, seus índices e o histórico da migration do Entity Framework.
4. A configuração local da API usa `Server=localhost`. Se sua instância tiver outro nome, ajuste `ConnectionStrings:LocalSqlServer` em `backend/HabiTech.Api/appsettings.Development.json` ou defina a variável `ConnectionStrings__LocalSqlServer` no ambiente em que iniciar a API. Para uma instância SQL Express nomeada, por exemplo, use `Server=localhost\\SQLEXPRESS` na string de conexão.

Em desenvolvimento, a API também tenta aplicar as migrations do Entity Framework na inicialização. Assim, se o banco já existir e o usuário configurado tiver as permissões necessárias, não é preciso criar manualmente as tabelas. O script SQL é útil para preparar o banco e o login da aplicação antes de iniciar a API.

## Executar frontend e API

Na raiz do projeto, instale as dependências do frontend:

```powershell
npm install
```

Abra dois terminais na raiz do repositório. No primeiro, inicie a API:

```powershell
npm run dev:api
```

A API local fica disponível em `http://localhost:5205`. No segundo terminal, inicie o frontend:

```powershell
npm run dev
```

Abra o endereço local mostrado pelo Vite (normalmente `http://localhost:5173`). O Vite encaminha as rotas `/api` e `/health` para a API em `localhost:5205`.

### Login de demonstração

- **E-mail:** `demo@example.test`
- **Senha:** `demo2025`

Esse login é da aplicação. O login SQL `habitech_app` é usado internamente pela API para acessar o banco e é independente da conta demonstrativa.

## Como os componentes trabalham juntos

1. O usuário preenche os instrumentos no frontend React.
2. Os rascunhos são mantidos no armazenamento local do navegador.
3. Quando a API local está disponível, os instrumentos Residencial, Não Residencial e Ocupação Predial enviam seus registros para os endpoints de sincronização.
4. A API valida o login demonstrativo, emite um token JWT e associa cada registro ao e-mail autenticado.
5. O Entity Framework Core grava os registros sincronizados no SQL Server. Os campos do formulário ficam em `ValuesJson`, permitindo persistir estruturas variáveis sem criar uma tabela para cada instrumento.
6. Os outros fluxos continuam funcionando com os mocks locais enquanto sua integração com a API não estiver implementada.

## API local

| Método | Rota | Uso |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Validar a conta demonstrativa e emitir token JWT. |
| `GET` | `/api/v1/session` | Validar a sessão autenticada. |
| `GET` / `POST` | `/api/v1/sync/records` | Consultar e sincronizar registros suportados. |
| `GET` | `/health/live` | Verificar se a API está ativa. |
| `GET` | `/health/ready` | Verificar se a API está pronta e consegue acessar o SQL Server. |
| `GET` | `/openapi/v1.json` | Consultar o documento OpenAPI em desenvolvimento. |

Veja [`backend/README.md`](./backend/README.md) para detalhes de configuração, endpoints e escopo atual da sincronização.

## Verificações de desenvolvimento

```powershell
npm run build
npm run lint
dotnet test backend\HabiTech.Api.Tests\HabiTech.Api.Tests.csproj
```

## Observações

- Este repositório é um projeto de estudo e portfólio; não use dados pessoais reais.
- Os registros demonstrativos são fictícios.
- Nenhuma licença de redistribuição foi definida neste repositório.
