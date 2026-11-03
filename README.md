<p align="center">
  <img src="./public/habitech-wordmark.svg" alt="HabiTech — Instrumentos de Pesquisa" width="320">
</p>

<h1 align="center">HabiTech — Sistema de Pesquisa Habitacional</h1>

<p align="center">
  Aplicação web para registrar, acompanhar e sincronizar levantamentos de campo.
</p>

## O que é o HabiTech

O HabiTech reúne formulários para pesquisas habitacionais e urbanas. A equipe pode criar registros, preencher formulários divididos em seções, manter cadastros em andamento, concluir visitas, consultar e editar registros e sincronizar os dados com uma API ASP.NET Core e um banco Microsoft SQL Server.

O sistema inclui cinco instrumentos:

| Instrumento | Uso |
| --- | --- |
| **Selagem** | Identificação e caracterização do espaço habitado e da unidade. |
| **Arrolamento** | Levantamento de famílias, pessoas e condições de moradia. |
| **Residencial** | Dados da unidade, responsável, moradores e infraestrutura. |
| **Não Residencial** | Identificação do imóvel e da atividade econômica. |
| **Ocupação Predial** | Identificação da edificação, tipologia, uso e ocupação. |

Cada instrumento tem sua lista de registros, busca, visualização, edição e situação. Os dados de exemplo são fictícios; não use informações pessoais reais.

## Fluxo e regras de cadastro

1. Ao escolher **Novo formulário**, a aplicação abre uma janela inicial com os dados de controle daquele instrumento.
2. Para começar um cadastro novo, preencha os campos obrigatórios dessa janela e escolha a ação para abrir o formulário. As seções do cadastro só são liberadas depois dessa validação.
3. Fechar a janela inicial pelo **X** cancela a abertura e retorna à lista. Não deixa a pessoa entrar nas seções com os dados iniciais obrigatórios em branco.
4. Ao editar um registro existente, a aplicação carrega os dados salvos e permite ir diretamente às seções. A visualização abre o cadastro existente em modo de leitura.
5. O identificador do formulário é gerado pelo sistema. Regras de campos como SEI e sua opção **Não se aplica**, entrevistador, número do selo e quantidade de famílias dependem do instrumento.
6. No Arrolamento, a quantidade de famílias deve ser um número inteiro igual ou maior que 1. Os demais campos obrigatórios são validados segundo cada formulário.
7. Os registros podem permanecer **Em andamento** enquanto não forem concluídos. Ao concluir, a situação passa a **Concluído**. Os formulários Não Residencial e Ocupação Predial também validam os campos obrigatórios das demais seções durante a conclusão.

## Como funciona a sincronização

O frontend mantém os registros e rascunhos no armazenamento local do navegador. Quando a API está disponível, ele envia alterações para o servidor e busca os registros remotos da conta autenticada. Se a conexão cair, os dados locais são preservados e a sincronização pode ser retomada quando o serviço voltar.

O backend aceita os cinco instrumentos. Cada registro é vinculado ao e-mail autenticado. O SQL Server guarda os valores específicos do formulário em `ValuesJson`, junto com o instrumento, situação e datas. A chave única por usuário e ID impede duplicações. A API também compara a data de atualização do cliente com a versão do servidor para não substituir dados mais recentes por uma cópia antiga. Anexos sincronizados de Selagem e Arrolamento também são aceitos.

## Tecnologias

- **Frontend:** React 19, TypeScript, Vite, TanStack Router, React Hook Form, Zod e Tailwind CSS.
- **Backend:** C#, ASP.NET Core 10, Entity Framework Core, JWT, OpenAPI e health checks.
- **Banco de dados:** Microsoft SQL Server.

## Executar em um computador novo

As instruções abaixo consideram Windows e PowerShell. O frontend, a API e o SQL Server são três componentes separados; deixe o SQL Server ativo e execute a API e o frontend em dois terminais distintos.

### 1. Instalar os pré-requisitos

Instale e confirme estes programas:

- **Git**, para clonar o repositório.
- **Node.js LTS**, que inclui npm. Depois da instalação, `node --version` e `npm --version` devem funcionar no PowerShell.
- **.NET 10 SDK**. Confirme com `dotnet --list-sdks` que aparece uma versão `10.x`.
- **SQL Server Developer** (gratuito para desenvolvimento) ou **SQL Server Express**. O SQL Server deve estar instalado e em execução; LocalDB sozinho não atende ao login SQL usado aqui.
- **SQL Server Management Studio (SSMS)**, para criar o banco e o usuário técnico.

### 2. Baixar o projeto

Abra o PowerShell na pasta onde deseja guardar o código e execute:

```powershell
git clone https://github.com/Rodrigojesussilva/HabiTech.git
cd HabiTech
```

Se estiver usando outro endereço de repositório, troque a URL do `git clone` pela URL exibida no botão **Code** do GitHub.

### 3. Preparar o SQL Server e criar o banco

1. Abra o **SQL Server Configuration Manager** e confirme que o serviço da instância do SQL Server está iniciado. No SSMS, conecte-se à instância instalada. Nomes comuns são `localhost`, `localhost\\SQLEXPRESS` ou `NOME-DO-PC\\SQLEXPRESS`; use o que corresponde à sua instalação.
2. Para habilitar autenticação SQL, no SSMS clique com o botão direito no servidor, abra **Properties > Security**, selecione **SQL Server and Windows Authentication mode** e confirme. Se mudou essa opção, reinicie o serviço SQL Server antes de continuar.
3. No SSMS, conecte-se como administrador do SQL Server. Abra o arquivo `database/sqlserver/create-database.sql` do clone.
4. No início do script, substitua `CHANGE_ME_BEFORE_RUNNING` por uma senha forte que você escolher para este computador. Para que os comandos mostrados funcionem sem ajustes, use letras, números e caracteres como `!`, `@`, `#`, `_` ou `-`; evite aspas, ponto e vírgula e `$`. Essa senha será da conta técnica do banco, não da tela de login do HabiTech. Guarde-a para o próximo passo. Não coloque sua senha no README e não envie o arquivo SQL modificado ao GitHub.
5. No menu do SSMS, marque **Query > SQLCMD Mode**. Execute o script com **Execute**. A opção SQLCMD é necessária porque o script usa `:setvar`.
6. O script cria o banco `HabiTechLocal`, o login SQL `habitech_app`, o usuário correspondente no banco e permissões de leitura e gravação. O Entity Framework cria/aplica migrations pendentes ao iniciar a API.

### 4. Configurar e iniciar a API (backend)

No primeiro terminal do PowerShell, ainda na pasta `HabiTech`, salve a senha escolhida em User Secrets. Substitua `SUA_SENHA_LOCAL` pela mesma senha que colocou no script SQL:

```powershell
dotnet user-secrets set "ConnectionStrings:LocalSqlServer" "Server=localhost;Database=HabiTechLocal;User Id=habitech_app;Password=SUA_SENHA_LOCAL;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=True" --project backend/HabiTech.Api
```

Se sua instância for nomeada, ajuste somente o servidor da conexão. Por exemplo, para SQL Server Express:

```powershell
dotnet user-secrets set "ConnectionStrings:LocalSqlServer" "Server=localhost\SQLEXPRESS;Database=HabiTechLocal;User Id=habitech_app;Password=SUA_SENHA_LOCAL;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=True" --project backend/HabiTech.Api
```

Agora inicie a API:

```powershell
npm run dev:api
```

Deixe esse terminal aberto. A API fica em `http://localhost:5205`. Abra `http://localhost:5205/health/live` para confirmar que ela está ativa e `http://localhost:5205/health/ready` para confirmar que consegue acessar o SQL Server.

### 5. Instalar e iniciar a interface (frontend)

Abra um segundo terminal do PowerShell na pasta `HabiTech`. Instale as dependências e inicie o Vite:

```powershell
npm install
npm run dev
```

Deixe esse terminal aberto e abra no navegador o endereço que o Vite mostrar, normalmente `http://localhost:5173`. Durante o desenvolvimento, o Vite encaminha as chamadas `/api` e `/health` para a API na porta `5205`.

### 6. Entrar na aplicação

Use a conta local de demonstração na tela de login:

- **E-mail:** `demo@example.test`
- **Senha:** `demo2025`

Esse login é apenas para entrar no HabiTech em desenvolvimento. Não é usuário nem senha do SQL Server. O usuário do banco é `habitech_app`, e a senha é a escolhida por você na etapa 3.

## Portas e como conferir se está tudo ativo

| Serviço | Endereço local | Como confirmar |
| --- | --- | --- |
| Frontend Vite | `http://localhost:5173` | A página de login do HabiTech abre no navegador. |
| API ASP.NET Core | `http://localhost:5205` | `http://localhost:5205/health/live` responde saudável. |
| API + SQL Server | `http://localhost:5205/health/ready` | A resposta indica que o banco está acessível. |
| SQL Server | `localhost` ou sua instância | O SSMS conecta e o banco `HabiTechLocal` aparece em **Databases**. |

O `docker-compose.yml`, quando utilizado, executa somente o frontend na porta `8082`; não cria nem inicia a API ou o SQL Server.

## Problemas comuns

- **O script SQL reclama de `SQLCMD` ou `setvar`:** no SSMS, habilite **Query > SQLCMD Mode** e execute novamente.
- **A API não consegue conectar ao banco / erro de login 18456:** confira se o serviço SQL está ativo, se a instância informada em `Server=` é a correta, se Mixed Mode está habilitado e se a senha é idêntica à definida no script. Se alterou a senha no SQL, rode novamente o comando `dotnet user-secrets set` com a nova senha.
- **A API inicia, mas `/health/ready` indica falha:** `/health/live` verifica apenas a API; o endpoint `/health/ready` verifica o banco. Resolva a conexão com o SQL Server e reinicie a API.
- **A API diz que falta `ConnectionStrings:LocalSqlServer`:** repita o comando `dotnet user-secrets set` na pasta do repositório e confirme que usou `--project backend/HabiTech.Api`.
- **A porta 5205 ou 5173 já está em uso:** feche a outra aplicação que a está usando e inicie novamente. O Vite também pode mostrar outra porta livre; nesse caso, abra o endereço que ele imprimir.
- **O site abre, mas não carrega dados remotos:** mantenha os dois terminais em execução, confirme os endpoints `/health/live` e `/health/ready` e atualize a página.
- **O comando `npm` ou `dotnet` não é reconhecido:** instale Node.js LTS ou .NET 10 SDK e abra um novo PowerShell para atualizar o PATH.

## API e armazenamento

| Método | Rota | Finalidade |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Validar uma conta de demonstração e emitir JWT. |
| `GET` | `/api/v1/session` | Consultar a sessão autenticada. |
| `GET`, `POST` | `/api/v1/sync/records` | Buscar e sincronizar registros da conta autenticada. |
| `GET` | `/api/v1/lookup/cep/{cep}` | Consultar endereço por CEP. |
| `GET` | `/health/live` | Verificar se a API está ativa. |
| `GET` | `/health/ready` | Verificar se o SQL Server está acessível. |
| `GET` | `/openapi/v1.json` | Documento OpenAPI em desenvolvimento. |

Os registros sincronizados ficam em `dbo.SyncedInstrumentRecords`. `UserEmail` + `RecordId` identificam cada registro; `ValuesJson` contém os campos do instrumento. A senha SQL é mantida localmente em .NET User Secrets e não precisa ser gravada em arquivos versionados.

## Estrutura do repositório

```text
src/                         Frontend React, instrumentos, páginas e sincronização
backend/HabiTech.Api/        API ASP.NET Core, autenticação e acesso ao SQL Server
database/sqlserver/          Script para criar o banco e o usuário técnico local
public/                      Marca, ícones e arquivos estáticos
```

Mais detalhes da API: [backend/README.md](./backend/README.md). Guia local resumido: [DESENVOLVIMENTO-LOCAL.md](./DESENVOLVIMENTO-LOCAL.md).

## Comandos de desenvolvimento

Na raiz do repositório:

```powershell
npm run dev       # inicia o frontend
npm run dev:api   # inicia o backend (em outro terminal)
npm run build     # compila o frontend para produção
npm run lint      # verifica o código do frontend
dotnet build backend/HabiTech.Api/HabiTech.Api.csproj
```

As contas incluídas são demonstrativas e inseguras para produção. Antes de publicar uma instalação, configure autenticação, chave JWT, connection string e contas com segredos próprios do ambiente e não use dados reais neste ambiente local.
