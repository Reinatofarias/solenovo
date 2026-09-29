# SOLE — PRD v0.1

29/09/2026. Escopo confirmado nesta conversa: camisaria de produtos físicos; ainda não há catálogo, fotos, preços, variantes, identidade visual ou regra de frete. O responsável pediu preparar a estrutura, com catálogo vazio e sem habilitar vendas.

## Visão e objetivos

Apresentar a camisaria e, em entregas futuras, permitir descobrir camisas, selecionar uma variante e comprar com pagamento confirmado pelo servidor. Negócio: venda mensurável e operação confiável. Usuário: compreender a oferta e o custo antes de pagar.

## Entrega atual — estrutura sem vendas

- Aplicação Next.js/TypeScript executável e preparada para Vercel.
- Home institucional provisória, catálogo vazio, carrinho vazio e checkout indisponível.
- Modelo validado de camisa e variantes por SKU, sem produtos de demonstração na aplicação.
- Repositório de catálogo somente no servidor; API pública expõe apenas produtos publicados e campos permitidos.
- Endpoint de saúde da aplicação, páginas de erro e navegação responsiva.
- Testes do isolamento de rascunhos, dados inválidos, duplicidade de SKU e indisponibilidade de vendas.
- Sem cadastro, formulário, cookies de marketing, analytics externo ou cobrança nesta entrega.

## MVP comercial posterior

Catálogo real, fotos autorizadas, variantes/estoque, carrinho persistente, cotação de frete, pedido, Mercado Pago, webhook, reconciliação, operação, políticas e mensuração. Cada feature depende de SPEC pronta e das regras reais; esta entrega não conclui o MVP.

## Pós-MVP e exclusões

Contas de clientes, fidelidade e ERP serão avaliados depois. Nenhum preço, tecido, tamanho, garantia, prazo, contato ou disponibilidade será inventado. O protótipo visual não define a identidade definitiva da marca.

## Aceite e dependências

Build, lint, tipos e testes aprovados; navegação sem links quebrados; API de catálogo retorna lista vazia; tentativas de pedido e pagamento são recusadas no servidor. Nenhuma variável de ambiente pode ativar vendas nesta versão. Dados comerciais e acesso à Vercel continuam pendentes para fases posteriores.

SPEC implementável: `docs/02-specs/foundation.spec.md`. Esta redução de escopo registra a instrução explícita de preparar somente a estrutura; não dispensa documentação das funcionalidades comerciais futuras.
