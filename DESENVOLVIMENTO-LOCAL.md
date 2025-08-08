# 🚀 Desenvolvimento Local - Frontend + Backend

Este guia mostra como configurar o ambiente de desenvolvimento local completo, conectando o frontend React com os serviços de backend rodando via Docker.

## 📋 Pré-requisitos

- ✅ **Docker e Docker Compose** instalados
- ✅ **Node.js 18+** para o frontend
- ✅ **Credenciais do repositório privado** (GitHub token)

## 🏗️ Setup do Backend Local

### 1. Configurar Credenciais

```bash
cd backend-services
cp .env.local.example .env.local  # Se existir, ou:
# O script criará automaticamente um template
```

Edite `.env.local` com suas credenciais:
```env
# Private Repository Access (obrigatório)
PRIVATE_REPO_USERNAME=seu_github_username
PRIVATE_REPO_PASSWORD=seu_github_token

# Database Passwords (pode manter os padrões)
MONGODB_PASSWORD=admin123
RABBITMQ_PASSWORD=admin123
STORAGE_PASSWORD=minio123456
```

### 2. Iniciar Serviços (3 Opções)

#### **🎯 Opção A: Minimal (Recomendado)**
Apenas serviços essenciais para desenvolvimento frontend:
```bash
cd backend-services
./start-selagem-only.sh
```
**O que inicia:**
- 🏗️ Infraestrutura: MongoDB, Redis, RabbitMQ
- 🚀 APIs: Selagem (7074) + Survey Resource (7076)
- ⏱️ Tempo: ~5-10 minutos
- 💾 Recursos: 2 cores, 4GB RAM

#### **🔨 Opção B: Sequencial (Seguro)**
Todos os serviços, um por vez:
```bash
cd backend-services
./start-local-sequential.sh
```
**O que inicia:**
- 🏗️ Infraestrutura completa
- 🚀 Todos os 13 microserviços
- ⏱️ Tempo: ~20-30 minutos
- 💾 Recursos: 4+ cores, 8GB+ RAM

#### **🎮 Opção C: Makefile**
```bash
cd backend-services
make dev-selagem-safe     # Minimal sequencial
make dev-sequential       # Todos sequenciais
```

## 🌐 URLs dos Serviços

Após iniciar os serviços, as seguintes URLs ficam disponíveis:

### 🔗 APIs Principais
| Serviço | URL Local | Descrição |
|---------|-----------|-----------|
| **Selagem** | `http://localhost:7074` | API de Selagens |
| **Survey Resource** | `http://localhost:7076` | API de Pesquisas |
| **Auth Resource** | `http://localhost:7079` | Autenticação |
| **User** | `http://localhost:7075` | Gestão de Usuários |
| **File** | `http://localhost:7072` | Upload de Arquivos |

### 🗄️ Infraestrutura
| Serviço | URL Local | Credenciais |
|---------|-----------|-------------|
| **MongoDB** | `localhost:27017` | - |
| **Redis** | `localhost:6379` | - |
| **RabbitMQ Management** | `http://localhost:15672` | admin/admin123 |
| **MinIO Console** | `http://localhost:9001` | - |

## ⚙️ Configuração Automática do Frontend

O frontend detecta automaticamente se está rodando em `localhost` e ajusta as URLs das APIs:

### 🏠 Desenvolvimento Local (`localhost`)
```javascript
SURVEY_RESOURCE: "http://localhost:7076"
SELAGEM: "http://localhost:7074"
AUTH: "http://localhost:7079"
// ... outros serviços
```

### 🌐 Produção (qualquer outro host)
```javascript
SURVEY_RESOURCE: "https://api-sehab.angeronacloud.com.br"
SELAGEM: "https://api-sehab.angeronacloud.com.br"
// ... URLs de produção
```

## 🔧 Controle Manual de Ambiente

### No Console do Navegador:
```javascript
// Forçar uso da API de produção (mesmo em localhost)
switchToProduction()

// Voltar para APIs locais
switchToLocal()

// Verificar configuração atual
console.log(CURRENT_API)
```

### Via Interface (Componente Debug):
O componente `ApiEnvironmentSwitcher` aparece automaticamente em `localhost` na tela de listagem de selagens.

## 🚀 Fluxo de Desenvolvimento

### 1. Iniciar Backend
```bash
# Terminal 1: Backend
cd backend-services
./start-selagem-only.sh
```

### 2. Iniciar Frontend  
```bash
# Terminal 2: Frontend
npm run dev
# Acesse: http://localhost:3000
```

### 3. Testar Integração
1. 🌐 Acesse `http://localhost:3000`
2. 📋 Vá para a listagem de selagens
3. 🔧 Verifique o "API Environment Switcher" (mostra se está usando APIs locais)
4. 🧪 Use o botão "Carregar Mock" para testar
5. ✏️ Teste a edição clicando no ícone de lápis

## 🛠️ Troubleshooting

### ❌ "Connection refused" nas APIs
**Problema:** Frontend não consegue conectar nas APIs locais.
**Soluções:**
1. Verificar se os serviços estão rodando:
   ```bash
   docker-compose -f docker-compose-local.yml ps
   ```
2. Testar conectividade manual:
   ```bash
   curl http://localhost:7076/health
   curl http://localhost:7074/health
   ```
3. Verificar logs dos serviços:
   ```bash
   docker-compose -f docker-compose-local.yml logs survey-resource
   docker-compose -f docker-compose-local.yml logs selagem
   ```

### 🐌 Build muito lento / Máquina travando
**Problema:** O build paralelo sobrecarrega a máquina.
**Soluções:**
1. Use o setup minimal: `./start-selagem-only.sh`
2. Aumente a memória do Docker (8GB+)
3. Em caso extremo, pare tudo:
   ```bash
   docker-compose -f docker-compose-local.yml down
   docker system prune -f
   ```

### 🔑 Erro "410 Gone" no download Go privado
**Problema:** Falha ao baixar dependências privadas.
**Soluções:**
1. Verificar credenciais em `.env.local`
2. Testar acesso manual:
   ```bash
   git clone https://github.com/Angerona-Sehab/mikros_extensions
   ```
3. Como alternativa, usar imagens de produção:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### 🔄 APIs ainda apontam para produção
**Problema:** Mesmo em localhost, está usando APIs de produção.
**Soluções:**
1. Limpar localStorage:
   ```javascript
   localStorage.removeItem('FORCE_PRODUCTION')
   window.location.reload()
   ```
2. Verificar se está em `localhost` (não em IP como `192.168.x.x`)

## 📊 Monitoramento

### Verificar Status dos Serviços
```bash
# Status resumido
docker-compose -f docker-compose-local.yml ps

# Recursos em uso
docker stats

# Logs em tempo real
docker-compose -f docker-compose-local.yml logs -f selagem survey-resource
```

### Health Checks das APIs
```bash
# Survey Resource
curl http://localhost:7076/health

# Selagem
curl http://localhost:7074/health

# Listar selagens (teste real)
curl "http://localhost:7076/survey-resource/v1/selagens?created_by=teste"
```

## 🎯 Resumo dos Comandos

```bash
# Setup completo em 3 comandos
cd backend-services
./start-selagem-only.sh
# Em outro terminal:
npm run dev
```

**🎉 Pronto! Agora você tem o ambiente completo de desenvolvimento local funcionando.** 