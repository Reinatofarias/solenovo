# Execução e deploy da fundação

Node 22.x e npm; `npm ci`, `npm run dev`, `npm run check`, `npm run build`, `npm start`. Windows com restrição de execução PowerShell pode usar `npm.cmd` sem alterar a política do sistema.

Vercel: importar o repositório quando o acesso for fornecido, framework Next.js, raiz do projeto, Node 22.x, install npm ci e build npm run build. Não há banco, secrets obrigatórios nem configuração de pagamento nesta etapa. Não vincular a projeto desconhecido.

Preview protegida e sem indexação. Produção comercial bloqueada enquanto catálogo, regras, integração, políticas e QA não estiverem concluídos. Qualquer publicação desta versão é somente pré-abertura com vendas fechadas. Não promover Preview assumindo troca automática de configuração embutida.

CI local via npm run check; CI remota/deploy pendentes de repositório e conta confirmados. Não existe migration ou backup de banco nesta etapa; catálogo é arquivo versionado. Antes de pedidos reais: backup/restore, migrations compatíveis e rollback ensaiados conforme roadmap.
