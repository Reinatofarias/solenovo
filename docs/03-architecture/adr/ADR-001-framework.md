# ADR-001 — Next.js e TypeScript

## Status
Accepted para a fundação, 29/09/2026.

## Context
Camisaria com futura renderização comercial e checkout no servidor, deploy Vercel confirmado. Comparação preliminar em `docs/initial-planning.md`.

## Decision
Next.js App Router, React, TypeScript strict, Node 22 e npm com lockfile. CSS próprio com tokens nesta etapa; não adicionar biblioteca de componentes ou formulários sem necessidade. Server Components por padrão; client boundary apenas para recuperação de erro.

## Alternatives Considered
SPA exigiria composição adicional para SEO e servidor; API separada adicionaria operação sem necessidade atual; plataforma pronta exigiria validar liberdade do checkout. CSS Modules continua opção para componentes futuros.

## Consequences
### Positives
Uma base, renderização server-side e integração direta ao destino Vercel.
### Negatives
Atualizações do framework e fronteiras de cache/servidor exigem atenção contínua.

## Security Impact
Catálogo server-only; nenhuma credencial pública. Dependências verificadas na instalação.
## Performance Impact
HTML no servidor e fontes locais; sem bibliotecas de animação ou trackers.
## Cost Impact
Nenhum fornecedor adicional necessário à execução local; custo Vercel ainda depende do plano.
## Scalability Impact
Interfaces de repositório permitem trocar catálogo local por persistência sem mudar a UI.

Fonte consultada: [instalação oficial](https://nextjs.org/docs/app/getting-started/installation), 29/09/2026. Versões efetivas registradas no lockfile.
