# Contribuindo com a SOLE

Começar pelo PRD, SPEC da feature e roadmap. Manter hipóteses separadas de regras confirmadas. Não cadastrar produtos, preços ou promessas fictícios no catálogo da aplicação; fixtures ficam em testes.

Executar `npm ci`, `npm run check` e `npm run build`. No Windows, usar `npm.cmd` se necessário. Commits pequenos com prefixos feat/fix/docs/test/chore. Não alterar regras financeiras ou habilitar compras sem SPEC, integração testada e dados comerciais completos.

Catálogo estrutural: `src/infrastructure/catalog/products.json`; schema: `src/domain/catalog/product.ts`. Arquivo somente leitura, não substituirá banco/estoque transacional. Novas dependências precisam de justificativa e lockfile atualizado.
