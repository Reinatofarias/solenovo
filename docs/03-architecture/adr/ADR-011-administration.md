# ADR-011 — Administração local antes do Supabase

## Status
Accepted como etapa transitória.
## Context
O operador precisa montar o catálogo antes de banco e storage gerenciados.
## Decision
Painel `/admin` usa repositório JSON e uploads locais somente em desenvolvimento. Na Vercel, mutações são bloqueadas por construção até adaptadores Supabase Database e Storage. Domínio, casos de uso e UI não dependem do formato JSON.
## Alternatives Considered
Esperar Supabase atrasaria a operação; escrever no filesystem da Vercel perderia dados; editar JSON manualmente não atende upload/variantes.
## Consequences
### Positives
Operação local imediata e contrato claro de migração.
### Negatives
Dados locais precisam ser migrados e não estão disponíveis entre máquinas.
## Security Impact
Admin autenticado, arquivos validados e diretórios controlados.
## Performance Impact
Adequado a catálogo inicial pequeno; leitura integral será substituída.
## Cost Impact
Sem custo adicional local.
## Scalability Impact
Não escala horizontalmente; bloqueio explícito evita uso incorreto em Vercel.
