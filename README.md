# SOLE — Camisaria

Estrutura inicial de uma camisaria de produtos físicos, com destino de deploy na Vercel. **Catálogo vazio e vendas desabilitadas**, conforme escopo confirmado. Não há dados comerciais, banco ou integração financeira ativos.

## Executar

Requer Node.js 22.x e npm. Em PowerShell com scripts restritos, substituir `npm` por `npm.cmd`.

```sh
npm ci
npm run dev
```

Abrir `http://localhost:3000`. Esta versão não exige variáveis de ambiente; `.env.example` registra essa condição. Nunca usar credenciais produtivas em desenvolvimento.

```sh
npm run check
npm run build
npm start
```

`check` executa lint, typecheck e testes unitários. Build é verificado separadamente. Resultados e limitações constam em [verificação da fundação](docs/13-quality/foundation-verification.md).

## O que está implementado

- Home provisória, coleção, sacola vazia, checkout indisponível, loading, 404 e erro.
- Layout responsivo, navegação por teclado e tipografia local sem fontes externas.
- Catálogo no servidor com validação de produtos/variantes e projeção pública.
- API de catálogo e liveness; APIs de pedido/pagamento recusam operações com 503.
- Noindex de pré-abertura e cabeçalhos básicos de segurança.

Rotas: `/`, `/produtos`, `/carrinho`, `/checkout`, `/api/products`, `/api/health`. Não há PDP, admin, carrinho persistente ou checkout funcional nesta entrega.

## Catálogo

[products.json](src/infrastructure/catalog/products.json) começa com `[]`. O [schema](src/domain/catalog/product.ts) valida produtos e variantes. Fixtures existem somente nos testes. Rascunhos não são retornados pela API. Produto publicado exige imagem local autorizada e variantes válidas. A inclusão de um produto **não habilita vendas**.

O arquivo é somente leitura e versionado, não um sistema de estoque. Banco, migrations e reservas transacionais serão necessários antes de compras reais. Não há interface administrativa de cadastro ainda.

## Arquitetura e Vercel

Next.js App Router, React, TypeScript strict e Zod; domínio, aplicação, infraestrutura e apresentação separados. Versões fixadas no lockfile. Vercel usa o preset Next.js, raiz do repositório, Node 22.x, `npm ci` e `npm run build`. Nenhum projeto externo foi vinculado ou publicado nesta execução.

Antes do deploy, confirmar conta, projeto, plano e domínio; Preview protegida. Esta versão permanece sem vendas em qualquer ambiente. [Plano de deploy](docs/14-devops/deployment.md).

## Documentação e próximos passos

- [PRD do recorte atual](docs/01-product/PRD.md)
- [SPEC da fundação](docs/02-specs/foundation.spec.md)
- [Roadmap completo](docs/implementation-plan.md)
- [API](docs/12-api/api-spec.md)
- [Estrutura documental](docs/README.md)
- [Pendências comerciais](docs/00-discovery/open-questions.md)

Próximo slice depende de catálogo real, fotos, preços, tamanhos/cores, frete e políticas. Mercado Pago continua pendente: modalidade, contratos atuais, tokenização, webhook e reconciliação serão especificados e testados antes da ativação. Não há botão ou variável para abrir vendas prematuramente.
