# Persistência — estado atual

Nenhum banco provisionado, ORM escolhido ou migration aplicada. `src/infrastructure/catalog/products.json` é um catálogo versionado, somente leitura, inicialmente vazio. Interface de repositório separa esse armazenamento da aplicação.

O arquivo não é banco de estoque nem pode registrar reservas ou pedidos. Publicar dados reais exigirá revisão, nova build e documentação. Antes de habilitar vendas: PostgreSQL, migrations, constraints, transações, concorrência, backup e restore devem estar implementados e testados.
