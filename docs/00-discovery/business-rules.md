# Regras de negócio iniciais

Status: requisitos explícitos e propostas de Discovery. A modelagem formal será produzida na fase Domain.

## Invariantes confirmados pelo prompt

| ID | Regra | Implicação verificável |
| --- | --- | --- |
| BR-001 | Backend é autoridade de produto, preço, desconto, frete e total | Cliente envia identificadores e quantidade; valores são obtidos de fonte confiável |
| BR-002 | Redirecionamento ou callback do browser não aprova pedido | Backend confirma pagamento por comunicação segura com o provedor |
| BR-003 | Operações críticas são idempotentes | Repetição não cria novo pedido, cobrança ou baixa indevida |
| BR-004 | Webhooks exigem autenticidade e rastreabilidade | Persistência e validação conforme documentação específica; falhas reprocessáveis |
| BR-005 | Segredos privados ficam no servidor | Nenhum token privado em bundle, resposta pública ou log |
| BR-006 | Desenvolvimento não utiliza credenciais de produção | Separação de credenciais, dados e configuração de ambientes |
| BR-007 | Pagamento em andamento impede submissões redundantes na UI | Proteção adicional no servidor cobre múltiplas abas e concorrência |
| BR-008 | Toda feature precisa de SPEC e Definition of Ready | Implementação bloqueada até documentação aplicável estar pronta |
| BR-009 | Erros públicos não expõem detalhes internos | Mensagem útil ao cliente e correlação sanitizada para suporte |
| BR-010 | Informações comerciais ausentes não são inventadas | Assumptions e perguntas rastreadas; copy sem prova não é publicada |

## Regras propostas, ainda a formalizar

- BR-P01: representar dinheiro em unidades mínimas inteiras e moeda explícita; arredondamento documentado, sem ponto flutuante para cálculo financeiro.
- BR-P02: manter snapshots de itens e valores do pedido para preservar histórico quando o catálogo mudar.
- BR-P03: separar estado financeiro de estado de atendimento; falha de uma tentativa não cancela automaticamente todo o pedido.
- BR-P04: autorizar acesso ao pedido também no guest checkout; identificador imprevisível sozinho não substitui autorização.
- BR-P05: não repetir pagamento com nova chave enquanto o resultado anterior for desconhecido. Definir expiração e escopo de idempotência no ADR-012.
- BR-P06: confirmação de pagamento exige correspondência de pedido, recebedor, moeda, total e estado elegível, com atualização transacional.
- BR-P07: efeitos externos de confirmação e analytics devem partir de eventos persistidos e deduplicáveis.

## Regras comerciais ainda ausentes

Catálogo/variantes e unidade de venda (Q-01); preços/parcelas/cupons (Q-04); frete e estoque (Q-05); troca/cancelamento/reembolso (Q-06); elegibilidade de métodos (Q-07); privacidade e retenção (Q-12). Não assumir estoque ilimitado, frete grátis, desconto Pix ou parcelamento sem juros.

## Estados a avaliar na fase Domain

Pedido: criado, aguardando pagamento, pago e cancelado como proposta mínima. Pagamento/tentativa: criado, processando, pendente, aprovado e recusado, com tratamento explícito de resultado desconhecido. Reembolso parcial/total e contestação exigem estados próprios se suportados pela operação. Entrega será eixo separado se houver produto físico.

Essa lista não é uma state machine implementável: transições, guardas, concorrência e mapeamento do provedor ainda precisam ser especificados. Estado aprovado não pode regredir a pendente por evento atrasado; reembolso não deve ser descartado por uma regra simplista de estados sempre crescentes.
