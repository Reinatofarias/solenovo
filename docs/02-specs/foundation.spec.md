# Fundação da camisaria

## Context

Camisaria física sem dados comerciais fornecidos. Escopo autorizado: estrutura com catálogo vazio e vendas desabilitadas.

## Objective

Criar uma aplicação verificável que possa receber catálogo real e integrações futuras sem simular uma loja em operação.

## User Story

Como visitante, quero reconhecer a SOLE como camisaria e saber que a coleção ainda não está disponível, para não tentar uma compra inexistente.

## Functional Requirements

- FND-FR-001: `/` apresenta SOLE, camisaria e acesso a `/produtos`, sem promessa comercial não confirmada.
- FND-FR-002: `/produtos` lê catálogo pelo servidor e apresenta estado vazio quando não há publicados.
- FND-FR-003: `/carrinho` mostra estado vazio; `/checkout` informa indisponibilidade sem coletar dados.
- FND-FR-004: `GET /api/products` retorna projeção pública de produtos publicados; o catálogo inicial é `[]`.
- FND-FR-005: `GET /api/health` informa liveness, sem versões, secrets ou diagnóstico de banco inexistente.
- FND-FR-006: `POST /api/orders` e `POST /api/payments` retornam 503 `SALES_UNAVAILABLE`, sem ler/persistir dados ou contactar terceiros.
- FND-FR-007: modelo de produto valida identificador, slug, título, status, descrição, imagens locais com alt e variantes com SKU, tamanho, cor, preço em centavos e estoque inteiro. Campos comerciais podem faltar em rascunhos; publicados exigem imagem e variante.
- FND-FR-008: SKU e slug duplicados invalidam o catálogo; produto inválido não é publicado silenciosamente.
- FND-FR-009: publicação de produto por si só não ativa vendas; não há botão de adicionar nesta etapa.

## Non-Functional Requirements

- FND-NFR-001: Node 22, Next.js App Router, TypeScript strict, build reproduzível por lockfile.
- FND-NFR-002: 360 px até desktop sem overflow; navegação por teclado, landmarks, foco visível e respeito a reduced motion.
- FND-NFR-003: renderização majoritariamente no servidor, fontes do sistema, sem terceiros ou imagens remotas.
- FND-NFR-004: noindex e robots bloqueando indexação enquanto esta versão for pré-lançamento.

## Business Rules

BR-001/005/008/009/010 do Discovery. Preço e disponibilidade nunca vêm do browser. Catálogo inicial vazio. Identidade visual provisória. Sem inferência de tecidos, origem, gênero ou posicionamento de preço.

## Acceptance Criteria

1. Given catálogo vazio, When acessar catálogo, Then exibir mensagem honesta e nenhuma oferta/preço.
2. Given produto draft com custo interno, When consultar API, Then não expor o produto nem campos internos.
3. Given published sem imagem/variante, When validar catálogo, Then falhar com erro interno controlado.
4. Given duas variantes com SKU repetido, When validar catálogo, Then rejeitar a inconsistência.
5. Given qualquer corpo de pedido/pagamento, When POST na API, Then retornar 503 e não criar efeito financeiro.
6. Given rota inexistente, When navegar, Then exibir 404 com retorno para home.

## Edge Cases

Catálogo inválido; slug/SKU repetido; preço fracionário, negativo ou acima de inteiro seguro; estoque negativo; nenhum produto publicado; método HTTP não suportado.

## Error States

UI amigável sem stack trace. API retorna erro estável e requestId gerado no servidor; logs limitados ao nome da operação e requestId, sem payload ou erro bruto.

## Loading States

Navegação de catálogo apresenta mensagem de carregamento acessível via status.

## Empty States

Catálogo: coleção em preparação. Carrinho: nenhuma peça. Checkout: compras ainda indisponíveis. Nenhum CTA sem ação correspondente.

## Security Considerations

Sem endpoint de escrita de catálogo ou painel público. Repositório server-only. Secrets ignorados no Git; cabeçalhos contra framing e MIME sniffing; sem indexação. Não declarar readiness de pagamentos/banco pelo health check.

## Analytics Events

Nenhum tracker nesta entrega. Evento purchase impossível porque vendas estão bloqueadas. Plano comercial será especificado posteriormente.

## Dependencies

PRD v0.1; ADR-001 e ADR-005; modelo de catálogo, plano de segurança/QA/design/deploy desta entrega. Banco e Mercado Pago não são dependências de execução deste recorte.

## Definition of Done

Lint, typecheck, unitários e build aprovados; verificação HTTP e visual quando navegador disponível; limitações registradas. DoD não significa MVP comercial concluído.
