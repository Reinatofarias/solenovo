# ADR-002 — Provedor de banco de dados

## Status
Accepted, 29/09/2026.

## Context
O catálogo atual usa um arquivo JSON local, inadequado para escrita persistente na Vercel ou para estoque e pedidos. O domínio já define produtos, imagens e variantes; as telas consomem um contrato de repositório.

## Decision
Usar Supabase como provedor de PostgreSQL gerenciado. PostgreSQL será a fonte persistente para os dados operacionais. O schema inicial deve representar produtos, imagens e variantes e preservar as regras do domínio. Versionar migrations SQL em `supabase/migrations/`.

Manter ambientes e credenciais isolados. Segredos de acesso ao banco ficam exclusivamente no servidor e fora do Git. Não habilitar escrita pública; definir RLS e o fluxo de autorização antes de conectar operações administrativas.

## Consequences
### Positives
- PostgreSQL oferece constraints e transações para proteger a integridade dos dados.
- Supabase fornece o PostgreSQL gerenciado para a aplicação hospedada na Vercel.
- Migrations versionadas permitem reproduzir e revisar mudanças de schema.

### Follow-up required
- Provisionar projetos/ambientes Supabase e configurar variáveis secretas.
- Decidir cliente/ORM, pooling e procedimento de migrations em CI/release.
- Definir e testar políticas RLS e autorização de leitura/escrita.
- Implementar backup e ensaio de restore antes de produção.

## Alternatives Considered
Outros provedores PostgreSQL gerenciados. Supabase foi escolhido pelo responsável pelo projeto.

## Security Impact
Chaves privilegiadas nunca podem ser expostas ao navegador. A anon key não substitui autorização; políticas RLS e autorização administrativa precisam ser verificadas antes de liberar operações.

## Operational Impact
A aplicação permanece no armazenamento JSON até o projeto Supabase, schema e adaptador de repositório serem provisionados e testados. Nenhum pedido, pagamento, reserva ou estoque será tratado como persistido antes dessa etapa.