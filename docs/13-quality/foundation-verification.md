# Verificação da fundação — 29/09/2026

Escopo: [foundation.spec](../02-specs/foundation.spec.md), PRD v0.1. Ambiente local Windows, Node 22.23.2, npm 12.0.2, Next.js 16.3.7. Não é homologação comercial ou financeira.

## Evidências executadas

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Aprovado |
| `npm run typecheck` | Aprovado |
| `npm run test` | 16 testes aprovados em 2 arquivos |
| `npm run build` | Aprovado; rotas estáticas e APIs dinâmicas geradas |
| `npm ls --depth=0` | Dependências resolvidas sem pacotes faltantes |
| Auditoria durante instalação npm | 0 vulnerabilidades reportadas naquele momento |
| GET home, produtos, carrinho e checkout | HTTP 200 |
| GET rota inexistente | HTTP 404 e apresentação própria |
| GET /api/products | HTTP 200, `{ "data": [] }` |
| GET /api/health | HTTP 200, somente status/service |
| POST /api/orders e /api/payments | HTTP 503, SALES_UNAVAILABLE; payload com price e approved ignorado |
| Headers das rotas verificadas | X-Frame-Options DENY e X-Robots-Tag noindex/nofollow presentes |
| Chrome headless via agent-browser | Home abriu, links de coleção e sacola funcionaram, checkout indisponível visível |
| Console e erros de página | Nenhum erro registrado na sessão de verificação |
| Layout | Screenshots desktop 1440×1000 e mobile 390×844 inspecionados; sem overflow horizontal em 360, 390 e 768 px |
| Teclado | Primeiro Tab alcança “Pular para o conteúdo” |

Screenshots locais em `verification/home-desktop.png` e `verification/home-mobile.png`, ignorados pelo Git. A inspeção visual não é certificação completa de acessibilidade; leitor de tela, todas as combinações de zoom e métricas de campo não foram auditados.

## Cobertura dos testes

Catálogo real vazio; rascunhos ocultos; campos internos removidos; disponibilidade sem quantidade exata; preços negativos, zero, fracionários e fora do intervalo seguro rejeitados; estoque inválido rejeitado; published exige imagem/variante; slug/SKU duplicados rejeitados; caminhos remotos/traversal rejeitados; falha de repositório sanitizada com correlação; barreira de vendas estável.

## Limitações e dívida registrada

- ESLint 9.39.5 está fixado por compatibilidade com o peer dependency do eslint-plugin-react 7.37.5 usado pela configuração Next. npm sinalizou depreciação da linha 9; reavaliar a atualização do conjunto de plugins, sem forçar peers incompatíveis. Não é dependência runtime.
- npm bloqueou o postinstall opcional do unrs-resolver; lint e build funcionaram com os pacotes disponíveis. Não liberar scripts de instalação desnecessariamente.
- Nenhum banco, estoque transacional, autenticação, Mercado Pago, frete, analytics externo ou deploy implementado.
- Nenhum teste de cobrança, webhook ou recuperação financeira executado; continuam pendentes no roadmap.
- Identidade visual é proposta provisória. Sem imagens ou dados reais de produtos.

Resultado: estrutura local verificada; loja comercial permanece fechada.
