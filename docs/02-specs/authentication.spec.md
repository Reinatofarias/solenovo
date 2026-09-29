# Autenticação administrativa

## Context
A SOLE precisa de um operador-base antes da integração futura com Supabase Auth.
## Objective
Proteger páginas e mutações de `/admin` com sessão assinada no servidor.
## User Story
Como operador autorizado, quero entrar com e-mail e senha para gerenciar o catálogo.
## Functional Requirements
- AUTH-FR-001: login usa usuário-base definido por variáveis privadas.
- AUTH-FR-002: sessão usa cookie HttpOnly, SameSite Strict e expiração.
- AUTH-FR-003: credencial inválida retorna mensagem genérica.
- AUTH-FR-004: páginas e Server Actions validam sessão no servidor.
- AUTH-FR-005: logout invalida cookie; não existe cadastro público.
## Non-Functional Requirements
Senha apenas como hash scrypt; comparação constante; HMAC-SHA256; sessão máxima de oito horas.
## Business Rules
Um operador-base nesta fase. Produção exige configuração explícita.
## Acceptance Criteria
Given sessão ausente/adulterada, When acessar `/admin`, Then redirecionar. Given login válido, Then permitir. Given logout, Then negar novamente.
## Edge Cases
Configuração ausente, token expirado, assinatura inválida, hash malformado e tentativas rápidas.
## Error States
Mensagem pública genérica, sem secrets.
## Loading States
Botão indica envio e evita submissão redundante.
## Empty States
Não aplicável.
## Security Considerations
Cookie não acessível por JavaScript. Rate limit local deve ser distribuído antes da produção.
## Analytics Events
Nenhum evento externo ou log de credenciais.
## Dependencies
ADR-004; Supabase Auth substituirá o adaptador futuramente.
## Definition of Done
Testes de assinatura, expiração, credenciais e proteção; lint, tipos e build aprovados.
