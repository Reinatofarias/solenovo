# Mapa da documentação

Data: 29/09/2026. Discovery, planejamento, roadmap e documentação do recorte inicial sem vendas estão disponíveis. **A estrutura local foi implementada e verificada:** [PRD](01-product/PRD.md), [SPEC](02-specs/foundation.spec.md) e [evidências](13-quality/foundation-verification.md). Deploy na Vercel confirmado como destino, mas ainda não executado.

## Estrutura completa prevista

Atualização — estrutura da camisaria: PRD, SPEC `foundation.spec.md`, ADR-001/005 e documentos de arquitetura, domínio, checkout indisponível, integração pendente, segurança, privacidade, CRO, tracking, SEO, design, API, testes e deploy foram criados para o recorte **sem vendas**. A árvore abaixo mantém o inventário do projeto completo; não significa que todos os arquivos já existam. Catálogo e checkout comercial exigirão suas próprias SPECs completas antes de evoluir este recorte.

```text
README.md                                [criado]
CONTRIBUTING.md                           [planejado: governança]
CHANGELOG.md                              [planejado: governança]
SECURITY.md                               [planejado: segurança]
.env.example                             [planejado: integração/ambientes]
docs/
  README.md                              [criado]
  initial-planning.md                    [criado]
  implementation-plan.md                 [roadmap criado; refinamento na fase 11]
  00-discovery/                          [documentos iniciados]
    project-overview.md
    business-objectives.md
    personas.md
    customer-journey.md
    business-rules.md
    assumptions.md
    constraints.md
    risks.md
    open-questions.md
  01-product/
    PRD.md
  02-specs/
    homepage.spec.md
    catalog.spec.md
    product-page.spec.md
    cart.spec.md
    checkout.spec.md
    payment.spec.md
    order.spec.md
    webhook.spec.md
    analytics.spec.md
    seo.spec.md
    authentication.spec.md
    admin.spec.md
    shipping.spec.md                      [condicional: entrega física]
    coupon.spec.md                        [condicional: cupons no MVP]
    transactional-notifications.spec.md
    institutional-pages.spec.md
  03-architecture/
    stack-comparison.md
    system-architecture.md
    system-design.md
    adr/
      ADR-001-framework.md
      ADR-002-database.md
      ADR-003-payment-architecture.md
      ADR-004-authentication.md
      ADR-005-hosting.md
      ADR-006-state-management.md
      ADR-007-api-strategy.md
      ADR-008-observability.md
      ADR-009-media-storage.md
      ADR-010-checkout-architecture.md
      ADR-011-administration.md
      ADR-012-idempotency-and-async-processing.md
      ADR-013-inventory-and-reservations.md
      ADR-014-consent-and-tracking.md
  04-domain/
    domain-model.md
    entities.md
    business-rules.md
    database-model.md
    order-state-machine.md
  05-checkout/
    checkout-flow.md
  06-integrations/
    mercado-pago.md
    shipping.md                           [condicional]
    transactional-notifications.md
  07-security/
    security-plan.md
    threat-model.md
    privacy.md
  08-growth/
    cro-strategy.md
    page-copy-briefs.md
  09-analytics/
    tracking-plan.md
    business-metrics.md
  10-seo/
    seo-strategy.md
  11-design/
    design-system.md
    ux-flows.md
    accessibility-and-performance.md
  12-api/
    api-spec.md
  13-quality/
    test-strategy.md
    e2e-scenarios.md
    qa-checklist.md
    traceability-matrix.md
  14-devops/
    deployment.md
    migrations-and-rollback.md
    backup-and-restore.md
    observability-and-runbooks.md
```

## Convenções e rastreabilidade

- `CONFIRMED`: requisito explícito do prompt; não equivale a validação de mercado.
- `ASSUMPTION`: hipótese ou proposta reversível, ainda não validada.
- `TO BE DEFINED`: informação ausente. Questões externas recebem identificador Q; hipóteses recebem A; riscos recebem R.
- Cada SPEC terá Context, Objective, User Story, Functional Requirements, Non-Functional Requirements, Business Rules, Acceptance Criteria em Given/When/Then, Edge Cases, Error States, Loading States, Empty States, Security Considerations, Analytics Events, Dependencies e Definition of Done.
- Requisitos usarão prefixo da feature para unicidade, por exemplo PAY-FR-001; referências BR apontarão para regras canônicas.
- Cada ADR terá Status, Context, Decision, Alternatives Considered, Consequences (Positives/Negatives) e impactos em segurança, performance, custo e escala.
- ADRs começarão como Proposed; uma recomendação inicial não será rotulada Accepted por conveniência.
- A matriz de rastreabilidade ligará objetivo → requisito → SPEC → regra → teste → evidência.
- Mudanças relevantes atualizarão SPEC, ADR aplicável, domínio, API, README e changelog.

## Limite desta entrega

A estrutura inicial sem vendas foi documentada, implementada e verificada por solicitação do responsável. O inventário também inclui documentos comerciais futuros ainda não escritos; ele não declara o MVP pronto. Antes de avançar às funcionalidades de compra, resolver dados comerciais e produzir/revisar SPECs, ADRs e contratos correspondentes.
