# Administração de catálogo

## Context
O operador precisa cadastrar e revisar camisas antes do Supabase.
## Objective
Oferecer em `/admin` uma operação local completa, preparada para migração.
## User Story
Como operador, quero criar, editar, publicar e arquivar peças com várias fotos e variantes.
## Functional Requirements
- ADM-FR-001: dashboard resume peças, rascunhos, publicadas, variantes e estoque.
- ADM-FR-002: listar, criar e editar camisa.
- ADM-FR-003: nome, slug, descrição, coleção, tecido, modelagem, cuidados, destaque, SEO e status.
- ADM-FR-004: variantes por tamanho, cor, SKU, preço e estoque.
- ADM-FR-005: upload simultâneo de até 12 imagens JPEG, PNG, WebP ou AVIF, máximo 8 MB cada.
- ADM-FR-006: manter e remover imagens existentes.
- ADM-FR-007: impedir publicação sem descrição, imagem e variante.
- ADM-FR-008: arquivar sem apagar definitivamente.
- ADM-FR-009: somente publicados aparecem ao público; vendas permanecem desabilitadas.
- ADM-FR-010: gravação é bloqueada na Vercel até Supabase Database/Storage.
## Non-Functional Requirements
Mobile e desktop, labels acessíveis, validação server-side e escrita atômica.
## Business Rules
Slug/SKU únicos; preço em centavos; estoque não negativo; rascunho pode ser incompleto.
## Acceptance Criteria
Given fotos válidas, When salvar, Then todas aparecem. Given published incompleto, Then rejeitar sem alteração parcial. Given Vercel sem Supabase, Then bloquear mutação.
## Edge Cases
Duplicidade, concorrência, arquivo grande/incompatível, remoção e órfãos.
## Error States
Erros úteis sem stack trace.
## Loading States
Botões indicam salvamento; upload mostra quantidade selecionada.
## Empty States
Lista orienta criar a primeira peça.
## Security Considerations
Sessão revalidada em ações; imagens com nome aleatório; SVG proibido.
## Analytics Events
Nenhum tracker; auditoria persistente virá com Supabase.
## Dependencies
authentication.spec, domínio de produto e ADR-011/004.
## Definition of Done
Login, criação com várias fotos, edição, publicação/arquivo e leitura pública verificados.
