# Segurança — fundação

Ativos atuais: conteúdo do catálogo, integridade da build e configuração do projeto. Não coletar dados pessoais de compradores nesta versão.

| Ameaça | Controle atual | Verificação |
| --- | --- | --- |
| Divulgação de rascunho ou custo interno | Filtro e projeção explícita no serviço | Teste com campos internos e draft |
| Venda acionada por chamada direta | Endpoints POST fechados com 503, sem SDK ou banco | Teste da resposta e ausência de dados no body |
| XSS em conteúdo | Renderização React escapada, sem HTML arbitrário | Revisão dos componentes |
| Path/URL de imagem indevido | Apenas caminhos locais válidos; sem fetch de URLs fornecidas | Testes de schema |
| Segredo versionado/exposto | .gitignore, env.example sem valores, server-only | Revisão dos artefatos |
| Clickjacking/MIME sniffing | X-Frame-Options DENY e nosniff | Verificação HTTP |
| Erro revela infraestrutura | Resposta estável e log sanitizado | Teste de falha do repositório |

Sem autenticação nesta etapa porque não há área privada nem endpoint administrativo. Não implementar admin sem RBAC. CSRF, SQL injection, spoofing de webhook, replay, abuso de cupons e concorrência financeira serão cobertos antes dos respectivos endpoints; ausência desses recursos não equivale a certificação de segurança.

CSP específica será definida ao integrar scripts do provedor. Não prometer segurança completa com uma política ampla só para passar checklist.
