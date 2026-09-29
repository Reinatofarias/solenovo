# Registro inicial de riscos

Probabilidades qualitativas estimadas, sem histórico: alta (A), média (M), baixa (B). Impactos: crítico (C) ou alto (A). Responsáveis são papéis propostos, sujeitos a Q-09.

| ID | Risco / categoria | Prob. / impacto | Mitigação e evidência exigida | Responsável |
| --- | --- | --- | --- | --- |
| R-01 | Oferta ou público incorretos / comercial | A/A | Validar catálogo, entrevistas e mensagem antes de copy final | Produto/negócio |
| R-02 | Cobrança duplicada em retry/refresh / financeiro | M/C | Chave estável, unicidade e reconciliação; teste de timeout após aceite do provedor | Engenharia/QA |
| R-03 | Preço, cupom ou frete adulterado / financeiro | M/C | Recalcular no servidor; testes de payload manipulado | Engenharia/segurança |
| R-04 | Webhook falso, repetido, perdido ou fora de ordem / segurança | M/C | Autenticidade, inbox durável, consulta ao provedor, deduplicação e replay controlado; testes adversariais | Engenharia |
| R-05 | Venda sem estoque ou pagamento após reserva expirada / operação | M/C | Política de reserva e exceção; concorrência e pagamento tardio testados | Operação/engenharia |
| R-06 | Exposição de pedido por ID ou segredo vazado / segurança | M/C | Autorização por recurso, sanitização e gestão de secrets; testes IDOR e inspeção do bundle | Segurança |
| R-07 | Coleta excessiva e tracking impróprio / privacidade | M/A | Inventário, finalidade, retenção e controles definidos antes de tags; verificação de eventos | Privacidade/engenharia |
| R-08 | Falha Mercado Pago sem recuperação / tecnológico | M/A | Estado desconhecido explícito, retry seguro, conciliação e suporte; simulação de indisponibilidade | Engenharia/operação |
| R-09 | Frete, garantia ou parcelamento prometidos sem respaldo / comercial | A/A | Fonte e responsável por cada condição; revisão de conteúdo | Negócio |
| R-10 | Job perdido em hospedagem ou limite excedido / tecnológico | M/C | Execução durável, fila/quarentena e alertas; teste de interrupção e retomada | DevOps |
| R-11 | Conversão duplicada ou receita incorreta / dados | M/A | Purchase a partir do backend, ID único por destino e reconciliação; teste de reenvio | Dados/engenharia |
| R-12 | Pedido pago sem atendimento / operacional | M/A | Console, alertas, responsável e procedimento de expedição/reembolso | Operação |
| R-13 | Custo operacional incompatível / financeiro | M/A | Cotar infraestrutura, taxas, mídia e suporte com cenários de volume | Negócio/arquitetura |
| R-14 | Perda de dados ou migration irrecuperável / tecnológico | M/C | Backup, restore ensaiado e migrations compatíveis; evidência antes do deploy | DevOps |
| R-15 | UX móvel lenta ou inacessível / comercial | M/A | Orçamento de performance, imagens adequadas, testes de teclado e mobile | UX/QA |
| R-16 | Reembolso ou contestação não reconciliados / financeiro | M/C | Estados financeiros completos, trilha de auditoria e rotina de exceções | Operação/engenharia |

## Riscos que impedem implementação específica

Sem Q-01/Q-04/Q-05 não fechar cálculo financeiro ou estoque. Sem contratos oficiais da modalidade escolhida não implementar autenticação, tokenização ou webhook. Sem identidade e evidência comercial não publicar promessas. A preparação documental pode continuar registrando essas dependências.

## Riscos que impedem lançamento

Pendências críticas de conta/credenciais, total/frete, proteção de pedidos, políticas, responsáveis operacionais ou recuperação de dados. Nenhuma avaliação acima equivale a aprovação de segurança; threat model e testes serão produzidos nas fases previstas.
