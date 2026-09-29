# Objetivos de negócio e critérios de sucesso

Status: proposta inicial. Não há baseline de tráfego, receita ou conversão.

## Objetivos do comprador

Entender o que está comprando; comparar opções pertinentes; escolher variante sem erro; conhecer custo e prazo antes de pagar; concluir a compra; distinguir pedido recebido, pagamento pendente e pagamento aprovado; conseguir suporte.

## Objetivos e mensuração

| ID | Objetivo | Indicador e definição preliminar | Fonte / meta |
| --- | --- | --- | --- |
| OBJ-01 | Gerar vendas | Pedidos com pagamento confirmado; receita bruta confirmada separada de estornos | Backend; meta comercial Q-10 |
| OBJ-02 | Melhorar conversão | Sessões elegíveis com compra / sessões elegíveis no mesmo período | Analytics autorizado + confirmação backend; baseline Q-11 |
| OBJ-03 | Reduzir abandono | Checkouts sem pagamento confirmado após janela definida / checkouts iniciados | Janela TO BE DEFINED conforme métodos; não contar Pix ainda válido como abandono definitivo |
| OBJ-04 | Reduzir fricção financeira | Tentativas aprovadas / tentativas com resultado conclusivo; acompanhar pendentes separadamente | Backend + provedor; segmentar método e motivo |
| OBJ-05 | Aumentar valor percebido | Compreensão da oferta e conclusão de tarefas em pesquisa, além da conversão | Pesquisa qualitativa; público Q-02 |
| OBJ-06 | Viabilizar campanhas | Funil view_item → add_to_cart → begin_checkout → purchase com reconciliação | Plano de tracking futuro; sem PII nos eventos |
| OBJ-07 | Sustentar a operação | Pedidos pagos sem encaminhamento, falhas de webhook e tempo de resolução | Logs/console; responsáveis e SLA Q-09 |

Ticket médio proposto: receita bruta dos pedidos pagos / quantidade de pedidos pagos, no mesmo período e moeda. Reportar receita líquida de reembolsos separadamente. Add to Cart Rate e Checkout Initiation Rate exigem mesma unidade de análise e janela. Não misturar tentativas, pessoas e sessões. Receita por visitante depende de medição lícita e cobertura conhecida; consentimento e bloqueadores impedem tratar analytics como contabilidade.

## Critérios de sucesso técnico propostos

- Nenhuma cobrança ou baixa duplicada nos cenários de repetição e concorrência.
- Nenhum preço do cliente usado como autoridade financeira.
- Nenhum pedido privado acessível só por conhecimento do identificador.
- Confirmação visual e evento purchase apenas após confirmação confiável do backend.
- Fluxo completo verificável em smartphone, teclado e cenários de falha.
- Pagamento pendente recuperável após atualização da página e atraso de webhook.
- Backup restaurado em ensaio antes do lançamento; objetivos de recuperação definidos na fase DevOps.

São critérios de aceite propostos, não resultados medidos. Metas comerciais, janela de análise e orçamento de aquisição dependem de Q-10/Q-11; não inventar taxa de conversão desejada.
