# Design técnico — fundação

Leitura: JSON versionado → validação integral → filtro de publicados → projeção pública. Dados inválidos falham de maneira fechada; não ignorar silenciosamente uma variante inválida.

Cache: UI estática quando elegível pelo framework; API `/api/products` explicitamente dinâmica e `no-store`, permitindo substituir o repositório no futuro sem contrato de cache incorreto. Health retorna apenas liveness. Escritas financeiras retornam 503 constante e nunca consultam variáveis para ativar vendas.

Erros: API gera UUID para correlação, registra operação e requestId sem conteúdo do erro e devolve código público estável. UI usa error boundary e 404. Não há jobs ou retry nesta etapa porque não há operações externas.

Idempotência financeira, banco, estoque transacional e observabilidade externa continuam dependências do MVP futuro, não entregas implícitas desta estrutura.
