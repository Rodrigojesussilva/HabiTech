#  Sistema de Instrumentos de Pesquisa - SEHAB

Projeto frontend para o sistema de instrumentos de pesquisa da **Secretaria de Habitação da Cidade de São Paulo**, desenvolvido com **React + TypeScript + Vite**.

---

##  Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Cleave.js](https://nosir.github.io/cleave.js/) — para máscaras de input
- [Lucide Icons](https://lucide.dev/icons/) — para ícones
- [Framer Motion](https://www.framer.com/motion/) — para animações

---

##  Instalação

```bash
# Clonar o repositório
git clone https://github.com/Angerona-Sehab/frontend-instrumentos-pesquisa.git

# Entrar na pasta
cd frontend-instrumentos-pesquisa

# Instalar dependências
npm install

# Rodar o projeto localmente
npm run dev
## # Garantir que está na branch correta
git checkout feature/formulario-selagem

# Puxar as últimas atualizações do repositório remoto
git pull origin feature/formulario-selagem
# Após fazer alterações:
git add .
git commit -m "feat(selagem): [descrição do que foi feito]"
git push origin feature/formulario-selagem
```
New-Item -Path . -Name "columns.tsx" -ItemType "File"
New-Item -Path . -Name "data-table.tsx" -ItemType "File"
New-Item -Path . -Name "list.tsx" -ItemType "File"


---

##  Branches principais

- `main`: versão estável do projeto
- `feature/dashboard`: implementação do painel administrativo e estrutura de formulários
- `feature/formulario-selagem`: implementação do formulário específico de Selagem

---

##  Formulário de Selagem – Implementação

###  Branch de Desenvolvimento
> Todas as alterações relacionadas ao formulário de **Selagem** devem ser feitas na branch:
```
feature/formulario-selagem
```

Essa branch foi criada a partir da `feature/dashboard` e será usada exclusivamente para estruturar, ajustar e implementar os campos, regras de negócio, permissões e validações do formulário **Selagem**, conforme as definições da equipe técnica.

###  Tarefas Incluídas
- Criação da estrutura completa do formulário.
- Reorganização dos campos em única coluna com numeração sequencial (ex: 1.1, 1.2...).
- Aplicação de máscaras e validações (telefone, CPF, NIS).
- Implementação de regras de exibição condicional (ex: Terreno cercado, Uso Misto).
- Controle de permissões por tipo de usuário (Pesquisador, Técnico, Supervisor, Coordenador).
- Implementação do sistema de status: Novo, Em andamento, Finalizado, Validado, Enviado.
- Upload de anexos com renomeação e visualização.
- Geração automática do número SEHAB no padrão `SEHAB-/2025`.
- Preenchimento automático de campos: nome do entrevistador, subprefeitura, data/hora.

###  Como contribuir

```bash
# Certifique-se de estar na branch correta
git checkout feature/formulario-selagem

# Após fazer alterações:
git add .
git commit -m "feat(selagem): [descrição do que foi feito]"
git push origin feature/formulario-selagem
```

Depois de concluir um conjunto de funcionalidades, **crie um Pull Request (PR)** para a branch `feature/dashboard`.

---

## Licença

Este projeto é de uso interno da Secretaria de Habitação e não possui licença pública de redistribuição.
