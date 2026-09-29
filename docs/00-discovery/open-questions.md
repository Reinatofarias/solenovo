# Questões em aberto

Status em 29/09/2026: Q-01 parcialmente resolvida — camisaria, produtos físicos. O responsável informou não ter ainda catálogo/material comercial e pediu estrutura vazia sem vendas. Demais detalhes de Q-01 e perguntas abaixo continuam pendentes. Somente informações externas; decisões técnicas são responsabilidade do planejamento e dos ADRs. Não enviar senhas, tokens, CPF de clientes ou credenciais em resposta.

| ID | Informação necessária | Impacto / momento de definição | Quem pode responder |
| --- | --- | --- | --- |
| Q-01 | O que a SOLE vende? Produtos físicos, digitais ou serviços? Qual catálogo inicial, variantes e unidade de venda? | Bloqueia fechamento do MVP e domínio; antes do PRD final | Negócio |
| Q-02 | Quem compra, em quais regiões e por quais motivos? Há entrevistas ou histórico? | Personas, linguagem, canais e prioridades; antes de UX/copy final | Negócio/marketing |
| Q-03 | Quais diferenciais têm comprovação? Há logo, guia de marca, fotos autorizadas e referências visuais? | Posicionamento, prova, design e conteúdo; antes da UI final | Marca/marketing |
| Q-04 | Quais preços, condições de parcelamento, desconto e campanhas de cupom no lançamento? | Cálculo, resumo, integração e testes; antes das SPECs financeiras finais | Comercial |
| Q-05 | Se houver entrega: origem, regiões atendidas, cálculo de frete, prazos e fonte do estoque? Há retirada ou encomenda? | Checkout, reserva e fulfillment; antes de domínio/logística finais | Operação |
| Q-06 | Quais políticas e responsáveis de troca, cancelamento, reembolso e suporte? | Jornada pós-compra, conteúdo e exceções; antes do lançamento e das regras finais | Operação/negócio |
| Q-07 | Já existe conta Mercado Pago do vendedor e aplicação? Quais métodos/condições estão habilitados? Há um ou vários recebedores? | Modalidade e homologação; antes do ADR de pagamento ser aceito | Titular da conta |
| Q-08 | Há exigências adicionais de checkout próprio, como permanência integral no domínio ou restrição a componentes incorporados? | Escolha entre componentes e API; requisito atual de checkout próprio já é conhecido | Negócio |
| Q-09 | Quem atualiza catálogo/estoque, acompanha pedidos e trata falhas? Quantos operadores e quais acessos? | Console mínimo, autorização, alertas e rotinas; antes de admin final | Operação |
| Q-10 | Qual orçamento inicial/recorrente, prazo desejado, volume esperado e capacidade de manutenção? Há metas de venda? | Escopo, dimensionamento e priorização; antes de comprometer custo/prazo | Responsável pelo projeto |
| Q-11 | Já existem domínio, loja, ERP, analytics, contas de anúncios ou dados a migrar? | Integrações, SEO, migração e baseline; antes da arquitetura final | Negócio/tecnologia |
| Q-12 | Qual entidade vende e responde pelos dados? Quais contatos públicos, obrigações de retenção conhecidas e responsáveis pela validação das políticas? | Privacidade, termos e identificação comercial; antes da revisão de lançamento | Negócio/privacidade |
| Q-13 | Qual conta/equipe Vercel será usada? Já há plano contratado, projeto, repositório Git e acesso de gestão ao domínio? | Preparação dos ambientes e deploy; antes de T09/T27 do roadmap. O destino Vercel já está confirmado | Responsável técnico/conta |

## Ordem recomendada de resposta

Começar por Q-01, Q-02 e Q-03 para dar substância comercial ao PRD. Em seguida, Q-04 a Q-07 e Q-09 determinam checkout e operação. Q-10 orienta escopo e prazo; Q-11/Q-12 orientam integração e publicação. Q-08 só busca restrições adicionais, não reconfirma a instrução já dada.

## Registro de resolução

Ao receber resposta: preservar o ID, registrar resposta, data, fonte e documentos afetados; revisar assumptions relacionadas. Perguntas sem resposta continuam abertas. Não tratar propostas técnicas ou passagem de tempo como aprovação de regra de negócio.
