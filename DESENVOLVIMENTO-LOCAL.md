# Desenvolvimento local

Para clonar e configurar o projeto pela primeira vez em Windows, siga o passo a passo completo do [README principal](./README.md#executar-em-um-computador-novo). Este arquivo resume os comandos usados no dia a dia depois que Node.js, .NET 10, SQL Server, o banco e a connection string já estiverem configurados.

## Iniciar

Abra dois terminais PowerShell na raiz do repositório. No primeiro, inicie a API:

```powershell
npm run dev:api
```

No segundo, instale as dependências (somente na primeira execução ou quando elas mudarem) e inicie o frontend:

```powershell
npm install
npm run dev
```

Abra a URL informada pelo Vite, normalmente `http://localhost:5173`. A API fica em `http://localhost:5205`.

## Verificar

- `http://localhost:5205/health/live` confirma que a API está ativa.
- `http://localhost:5205/health/ready` confirma que o banco SQL Server está acessível.
- O banco local criado pelo script é `HabiTechLocal` e o usuário SQL técnico é `habitech_app`.
- A conta de demonstração da tela é `demo@example.test` / `demo2025`; ela não é a conta SQL.

Não há senha SQL padrão: defina uma senha local no script `database/sqlserver/create-database.sql` e salve o mesmo valor em .NET User Secrets conforme o [guia completo](./README.md#3-preparar-o-sql-server-e-criar-o-banco). Não salve segredos no Git.
