# Instrumentos de Pesquisa — demonstração SEHAB

Frontend responsivo em React, TypeScript e Vite para demonstrar os fluxos de pesquisa da SEHAB. O sistema funciona sem backend: consultas, gravações, anexos e buscas auxiliares recebem respostas locais simuladas pelo MSW.

## Stack

- React + TypeScript + Vite
- TanStack Router para navegação
- TanStack Query para estado e cache de consultas
- Axios para chamadas da camada de demonstração
- MSW para simular a API no navegador
- Socket.IO client preparado para integração futura, sem conexão automática
- Tailwind CSS, componentes Radix/ShadCN, React Hook Form e Zod

## Executar localmente

```bash
npm install
npm run dev
```

O MSW é iniciado antes da interface. As solicitações não reconhecidas geram erro no console; as rotas simuladas usam o prefixo `/mock-api`.

### Acesso demonstrativo

- E-mail: `piloto@sehab.gov.br`
- Senha: `sehab2025`

Os registros de exemplo de Selagem e Arrolamento são mantidos em memória durante a sessão do navegador. Rascunhos e formulários de Residencial, Não Residencial e Ocupação Predial são salvos automaticamente no armazenamento local do navegador e permanecem disponíveis após atualizar a página.

As listas dos cinco instrumentos estão disponíveis na barra lateral. Os formulários de Não Residencial e Ocupação Predial incluem visualização, edição e conclusão demonstrativas, sem conexão com serviços externos.

### Referências dos campos demonstrativos

Não foi localizado um modelo público oficial específico chamado “Não Residencial” ou “Ocupação Predial”. Por isso, esses dois questionários são protótipos, não reproduções de formulários oficiais. A estrutura combina a identificação territorial e as características de terreno e construção divulgadas pela Prefeitura para o cadastro imobiliário/IPTU com campos de visita, uso, unidades e condições de ocupação já presentes nos instrumentos habitacionais deste sistema.

- [Portal HABITASAMPA — Secretaria Municipal de Habitação](https://habitasampa.prefeitura.sp.gov.br/)
- [Prefeitura de São Paulo — informações sobre IPTU e características do imóvel](https://prefeitura.sp.gov.br/fazenda/w/servicos/iptu/2456)
- [Secretaria Municipal de Habitação — Prefeitura de São Paulo](https://prefeitura.sp.gov.br/web/habitacao)

## Integrações

Os endereços de API externos, serviços locais e consultas externas (ViaCEP, IBGE e REST Countries) foram removidos do fluxo. O Axios acessa somente rotas atendidas pelo MSW.

O cliente Socket.IO está disponível em `src/service/realtime.client.ts`; ele é criado com `autoConnect: false` e não é iniciado pela aplicação. Uma conexão futura exige uma URL e um servidor Socket.IO fornecidos explicitamente.

## Build e lint

```bash
npm run build
npm run lint
```

## Licença

Este projeto é de uso interno da Secretaria de Habitação e não possui licença pública de redistribuição.
