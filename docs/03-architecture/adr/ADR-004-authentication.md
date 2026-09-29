# ADR-004 — Autenticação administrativa transitória

## Status
Accepted para operação local; será superseded na integração Supabase.
## Context
É necessário um usuário-base protegido por senha antes do provedor definitivo.
## Decision
Credenciais privadas via ambiente, hash scrypt e sessão stateless assinada com HMAC em cookie HttpOnly. Autorização é verificada em páginas e Server Actions. Sem cadastro público.
## Alternatives Considered
Clerk adicionaria outro provedor antes do Supabase; Basic Auth oferece UX e gestão de sessão inferiores; senha hardcoded foi rejeitada.
## Consequences
### Positives
Sem serviço externo e fronteira de autenticação substituível.
### Negatives
Usuário único, sem MFA, reset ou revogação granular; inadequado para produção pública.
## Security Impact
Segredos fora do Git, expiração e comparação segura. Rate limit distribuído e MFA ficam obrigatórios antes do lançamento.
## Performance Impact
Validação HMAC local e barata.
## Cost Impact
Sem custo externo nesta fase.
## Scalability Impact
Interface de sessão preserva migração; tokens existentes serão invalidados na troca.
