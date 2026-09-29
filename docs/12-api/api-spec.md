# API da fundação

APIs públicas sem autenticação, somente leitura ou recusa de operação. Sem CORS aberto explicitamente. Sem aplicação de rate limit própria nesta versão local; proteção de plataforma deve ser definida antes da publicação. Não há API administrativa.

| Method / URL | Request | Response | Validação / erros |
| --- | --- | --- | --- |
| GET /api/health | Sem body | 200 `{status:"ok",service:"sole"}` | Somente liveness; não comprova banco/pagamento |
| GET /api/products | Sem filtros nesta etapa | 200 `{data:[]}` | Validação do catálogo; 500 `{error:{code:"CATALOG_UNAVAILABLE",message,requestId}}` |
| POST /api/orders | Body ignorado; não enviar dados reais | 503 `{error:{code:"SALES_UNAVAILABLE",message}}` | Nenhum pedido criado, independentemente do payload |
| POST /api/payments | Body ignorado | Mesmo 503 | Nenhuma chamada externa |

Todos retornam Cache-Control no-store. Outros métodos recebem comportamento 405 do framework. Projeção de produtos publicados: id, slug, name, description, images e variantes com id, size, color, priceInCents e available. Sem SKU, estoque exato ou campos arbitrários do JSON.
