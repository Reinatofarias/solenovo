# ADR-005 — Deploy na Vercel

## Status
Accepted para hospedagem; conta, plano e provisionamento pendentes.
## Context
O responsável definiu Vercel como destino do deploy.
## Decision
Aplicação Next.js com detecção nativa do framework. Nenhum `vercel.json` redundante. Runtime Node 22; npm ci e npm run build. Preview e produção usarão configurações separadas. Esta entrega não publica nem vincula projeto externo.
## Alternatives Considered
Contêiner próprio não foi escolhido porque o destino foi explicitamente definido. Banco e jobs futuros ainda exigem decisões próprias.
## Consequences
### Positives
Build e previews alinhados ao framework.
### Negatives
Necessidade de respeitar limites de funções, conexão ao banco e proteção de previews.
## Security Impact
Secrets por ambiente; produção nunca usada por PRs. Loja permanece fechada inclusive em eventual deploy desta versão.
## Performance Impact
Páginas estáticas quando possível, API de catálogo sem cache compartilhado nesta fundação.
## Cost Impact
Plano e limites ainda não contratados por esta execução.
## Scalability Impact
Sem persistência em disco de função; banco/fila externos serão projetados no slice financeiro.
