# Jornada do cliente

Status: proposta; canais, produto e logística dependem de confirmação.

| Etapa | Necessidade | Conteúdo / ação | Fricção e tratamento proposto | Sinal |
| --- | --- | --- | --- | --- |
| Descoberta | Reconhecer relevância | Home ou landing do produto coerente com anúncio/busca | Promessa divergente: manter mensagem consistente | page_view |
| Interesse | Entender produto | Imagens, descrição e benefício comprovável | Copy genérica: vincular feature → benefício → resultado | view_item |
| Escolha | Selecionar opção correta | Variante, quantidade e disponibilidade | Variante indisponível: bloquear seleção e explicar | select_item |
| Intenção | Rever a compra | Carrinho editável com valores claros | Surpresa de custo: informar condições e estimativa antes do pagamento | add_to_cart / view_cart |
| Dados | Identificar destinatário e entrega | Somente campos necessários | Excesso de campos: guest checkout e autofill; endereço condicional | begin_checkout / add_shipping_info |
| Revisão | Confirmar total | Servidor recalcula preço, desconto e frete aplicável | Mudança de preço: pedir nova revisão antes de cobrar | Resumo revisado |
| Pagamento | Pagar e receber feedback | Método e ação explícitos; submissão protegida | Timeout: mostrar resultado em verificação, sem nova cobrança automática | add_payment_info |
| Confirmação | Entender estado e próximo passo | Pedido consultado no servidor | Retorno de sucesso sem confirmação: mostrar pendente | purchase somente backend confirmado |
| Pós-compra | Acompanhar e obter ajuda | Pedido e contato autorizado | Falta de atualização: suporte e responsável operacional | Métricas operacionais |

## Caminhos alternativos obrigatórios

1. Estoque muda antes de pagar: revalidar, informar e impedir cobrança incompatível.
2. Cupom inválido, se existir: explicar sem alterar silenciosamente o total aceito.
3. Recusa conclusiva: manter pedido e permitir tentativa elegível sem expor códigos internos.
4. Timeout do provedor: manter resultado desconhecido e reconciliar a mesma tentativa.
5. Refresh ou perda de conexão: recuperar pedido mediante autorização; não recriar operação financeira.
6. Webhook duplicado ou fora de ordem: atualizar pelo estado confiável consultado e por transições válidas, sem duplicar efeitos.
7. Pagamento confirmado após expiração de reserva: suspender expedição automática e aplicar política de exceção definida antes da implementação.

## Princípios de experiência

Um CTA principal por contexto: conhecer produto, adicionar, revisar, pagar ou acompanhar. Loading deve indicar a operação em curso; erro deve indicar ação possível; estado vazio deve oferecer retorno ao catálogo. Feedback acessível não dependerá apenas de cor. Não prometer prazo, estoque, garantia ou frete gratuito sem fonte real.

Eventos são candidatos; a especificação de propriedades, consentimento, origem, destino e deduplicação pertence à fase Analytics. Não instalar tags nesta fase.
