# Arquitetura da fundação

Escopo implementável: PRD v0.1 e foundation.spec. Não representa o sistema financeiro completo.

```mermaid
flowchart LR
  UI[Server Components] --> APP[Serviço de catálogo]
  API[GET /api/products] --> APP
  APP --> PORT[Interface CatalogRepository]
  PORT --> LOCAL[Catálogo JSON vazio no servidor]
  APP --> MODEL[Validação e projeção de domínio]
  WRITE[POST orders/payments] --> CLOSED[503 - vendas indisponíveis]
```

`src/domain` contém contratos e validação sem dependências de UI. `src/application` coordena casos de uso e projeções. `src/infrastructure` implementa leitura do JSON e marca a fronteira server-only. `src/app` contém páginas e adaptadores HTTP; `src/components` contém apresentação compartilhada. O domínio não importa Next.js.

Não há database, autenticação, pedido persistido, fila ou SDK financeiro nesta entrega. Não criar implementações falsas que pareçam confirmar pagamentos.
