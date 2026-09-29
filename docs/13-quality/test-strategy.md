# Qualidade — primeira implementação

Automação: Vitest para invariantes de catálogo e barreira de vendas; ESLint, TypeScript strict e build Next.js. Testes significativos: draft excluído, projeção sem campos internos, preço inválido, estoque inválido, published incompleto, SKU/slug duplicado e erro de repositório sanitizado. Dados de testes fictícios ficam somente nos testes.

Verificação de execução: HTTP home/catálogo/carrinho/checkout/404, API vazia, APIs financeiras fechadas e headers. Inspeção visual mobile/desktop e teclado quando navegador disponível, com limitação registrada se não for possível.

Os nove E2E financeiros do roadmap continuam pendentes; não há integração financeira para homologar. Health ok não é evidência de MVP concluído.
