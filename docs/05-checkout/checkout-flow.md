# Checkout — estado da estrutura

Hoje: home → catálogo vazio; carrinho vazio → catálogo; acesso direto a checkout → mensagem de compras indisponíveis. Não há coleta de endereço, frete, CPF ou pagamento.

Fluxo comercial futuro: produto/variante → carrinho → dados → endereço → cotação validada no servidor → resumo → pedido idempotente → pagamento → confirmação servidor-servidor. Preços, grade, frete, políticas e contratos Mercado Pago ainda bloqueiam sua implementação.
