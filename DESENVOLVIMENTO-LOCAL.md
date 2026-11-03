# Desenvolvimento local

Este projeto oferece um frontend demonstrativo com dados fictícios e uma API .NET opcional. O modo padrão não requer Docker, banco de dados ou serviços externos.

## Pré-requisitos

- Node.js compatível com a versão definida no projeto
- .NET 10 SDK somente para executar a API e seus testes

## Executar o frontend

```powershell
npm install
npm run dev
```

Sem `VITE_API_BASE_URL`, o frontend usa respostas locais do MSW. Acesso demonstrativo: `demo@example.test` / `demo2025`.

## Executar a API opcional

Configure Azure SQL, JWT, conta demonstrativa e CORS usando .NET User Secrets. Os comandos e os passos para validar a conexão estão em [`backend/README.md`](./backend/README.md).

Quando a API estiver disponível, defina `VITE_API_BASE_URL` para a URL HTTPS da API antes de iniciar o frontend. Sem essa variável, a aplicação permanece no modo local.

## Testes

```powershell
npm run build
npm run lint
dotnet test backend\HabiTech.Api.Tests\HabiTech.Api.Tests.csproj
```
