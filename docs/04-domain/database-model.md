# Persistência — estado atual

Supabase foi escolhido como provedor de PostgreSQL (ADR-002). O projeto ainda não foi provisionado, e não há credenciais, cliente de acesso ou migrations aplicadas. `src/infrastructure/catalog/products.json` continua sendo o catálogo ativo, versionado, somente leitura e inicialmente vazio. A interface de repositório separa esse armazenamento da aplicação.

O modelo inicial contempla produtos, imagens e variantes conforme o domínio; migrations serão versionadas em `supabase/migrations/`. Definir cliente/ORM, políticas RLS e configuração por ambiente antes de conectar a aplicação.

O arquivo não é banco de estoque nem pode registrar reservas ou pedidos. Publicar dados reais exigirá revisão, nova build e documentação. Antes de habilitar vendas: PostgreSQL, migrations, constraints, transações, concorrência, backup e restore devem estar implementados e testados.
