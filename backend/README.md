# Backend HabiTech

API REST do HabiTech, implementada em C# com ASP.NET Core 10, Entity Framework Core e SQL Server. Ela autentica usuários de demonstração, sincroniza os cinco instrumentos, consulta CEP e informa a disponibilidade da API e do banco.

Para instalar o projeto desde o início, incluindo frontend, SQL Server e comandos de execução, siga o [README principal](../README.md#executar-em-um-computador-novo).

## Responsabilidades

- Emitir tokens JWT para as contas de demonstração configuradas.
- Vincular registros sincronizados ao e-mail autenticado.
- Ler e gravar Selagem, Arrolamento, Residencial, Não Residencial e Ocupação Predial.
- Sincronizar anexos de Selagem e Arrolamento.
- Consultar endereços por CEP usando BrasilAPI e ViaCEP como provedores alternativos.
- Expor health checks da API e da conexão SQL Server.

## Executar localmente

Pré-requisitos: .NET 10 SDK, SQL Server ativo, banco `HabiTechLocal` criado pelo script `../database/sqlserver/create-database.sql` e connection string salva em .NET User Secrets. Consulte as instruções detalhadas de instalação no README principal.

Na raiz do repositório, configure a connection string com a senha que você escolheu ao criar o banco (não existe uma senha SQL padrão compartilhada):

```powershell
dotnet user-secrets set "ConnectionStrings:LocalSqlServer" "Server=localhost;Database=HabiTechLocal;User Id=habitech_app;Password=SUA_SENHA_LOCAL;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=True" --project backend/HabiTech.Api
```

Depois inicie o backend:

```powershell
npm run dev:api
```

A API fica em `http://localhost:5205`. O frontend Vite encaminha `/api` e `/health` para essa URL. Em Development, migrations pendentes são aplicadas durante a inicialização. Se o banco estiver indisponível, veja `/health/ready`; `/health/live` confirma apenas que o processo da API está ativo.

## Contas locais — são diferentes

| Conta | Uso | Credencial local |
| --- | --- | --- |
| Login da aplicação | Entrar na tela do HabiTech | `demo@example.test` / `demo2025` |
| Usuário SQL | A API conectar ao banco | Login `habitech_app`; a senha é definida localmente por quem instala. |

A conta da aplicação é demonstrativa e fica em `appsettings.Development.json`. Ela não autentica no SQL Server. Nunca use essas credenciais ou a configuração de desenvolvimento em produção.

## Endpoints

| Método | Rota | Autenticação | Finalidade |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Pública, com limite de tentativas | Validar uma conta de demonstração e emitir JWT. |
| `GET` | `/api/v1/session` | Bearer JWT | Confirmar identidade da sessão. |
| `GET` | `/api/v1/sync/records` | Bearer JWT (ou token offline de demonstração em Development) | Buscar registros da conta autenticada. |
| `POST` | `/api/v1/sync/records` | Bearer JWT (ou token offline de demonstração em Development) | Criar ou atualizar registros em lote. |
| `GET` | `/api/v1/lookup/cep/{cep}` | Pública | Consultar endereço; recebe oito dígitos. |
| `GET` | `/health/live` | Pública | Verificar se a API está ativa. |
| `GET` | `/health/ready` | Pública | Verificar se o SQL Server está acessível. |
| `GET` | `/openapi/v1.json` | Development | Documento OpenAPI. |

## Sincronização e banco

Os registros ficam em `dbo.SyncedInstrumentRecords`. A combinação de `UserEmail` e `RecordId` identifica cada item; `ValuesJson` guarda os campos específicos do instrumento. O servidor não substitui uma versão mais recente por uma atualização de cliente mais antiga.

A API aceita lotes de até 25 registros; cada item precisa de ID, instrumento, situação, JSON de valores e datas válidas. O payload JSON tem limite de 20 MB por registro. As operações em lote usam transação; o resultado informa `stored` ou `server-newer` para cada ID.

O script SQL cria o banco e o usuário com permissões de leitura e gravação. As migrations pendentes são aplicadas pela API em Development. A senha do usuário SQL é guardada em .NET User Secrets, fora deste repositório.

## Compilar

Na raiz do repositório:

```powershell
dotnet build backend/HabiTech.Api/HabiTech.Api.csproj
```
