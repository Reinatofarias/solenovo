# Changelog

## 0.2.0 — 2026-09-29

- Implementação da Task T11 (Fase 12B — Produto e Carrinho mínimos):
  - Página de Detalhes do Produto (PDP) em `/produtos/[slug]` e redirect de `/produto/[slug]` com galeria de múltiplas fotos, especificações da camisa, seletor de variantes (tamanhos/cores) e disponibilidade de estoque.
  - Listagem da coleção (`/produtos`) com cards como links navegáveis e exibição de preços autênticos ("A partir de R$ ...").
  - Domínio e serviço de sacola (`src/domain/cart/`, `src/application/cart/`, `POST /api/cart`) com validação de variantes e cálculo de preços estritamente no servidor, imune a manipulação client-side.
  - Sacola interativa (`/carrinho`) com alteração de quantidade, remoção, cálculo de subtotal e contador reativo no cabeçalho via `useSyncExternalStore`.
  - SPEC formal em `docs/02-specs/pdp-and-cart.spec.md` e suíte de testes expandida para 33 testes aprovados, com lint e build validados.

## 0.1.0 — 2026-09-29

- Escopo confirmado: camisaria física, catálogo inicial vazio e vendas desabilitadas.
- Documentação do recorte de fundação, decisões Next.js/Vercel e contratos de catálogo.
- Aplicação Next.js/TypeScript com home provisória, coleção, sacola, checkout indisponível e erros.
- Modelo de variantes, projeção pública, API de leitura e bloqueio de operações financeiras.
- Testes de domínio e configuração de lint/typecheck/build. Resultados em relatório de verificação.

Sem banco, Mercado Pago, estoque transacional ou deploy nesta versão.
