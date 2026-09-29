# Página de Produto e Sacola (T11)

## Context

Com a fundação executável (Fase 12A) e a área administrativa local concluídas, a camisaria necessita da experiência de descoberta de produto e composição de sacola (Fase 12B — Task T11), preparando a jornada de compra sem habilitar cobranças financeiras prematuras.

## Objective

Disponibilizar a Página de Detalhes do Produto (PDP) para camisas publicadas e a gestão interativa da sacola de compras, validando variantes, preços e disponibilidade estritamente no servidor.

## User Stories

1. Como visitante, quero acessar a página de uma camisa publicada, ver suas fotos, composição, modelagem, escolher tamanho/cor e adicioná-la à sacola.
2. Como comprador, quero visualizar os itens na minha sacola, alterar quantidades, conferir o subtotal autêntico e entender as condições de pré-abertura comercial.

## Functional Requirements

- **PDP-FR-001**: `/produtos/[slug]` busca o produto pelo slug no catálogo do servidor. Se o produto não existir ou for rascunho/arquivado, retorna HTTP 404 (`notFound()`).
- **PDP-FR-002**: `/produto/[slug]` executa redirecionamento canônico permanente/imediato para `/produtos/[slug]`.
- **PDP-FR-003**: A PDP apresenta galeria com imagem principal e miniaturas navegáveis para produtos com múltiplas fotos.
- **PDP-FR-004**: Seletor de variantes interativo por tamanho e cor, atualizando o preço correspondente e indicando disponibilidade em tempo real.
- **PDP-FR-005**: Botão "Adicionar à sacola" desabilitado se a variação estiver sem estoque; quando habilitado, adiciona a variação à sacola e oferece confirmação visual.
- **PDP-FR-006**: Apresentação de especificações editoriais da camisa: descrição, tecido/composição, modelagem/caimento e cuidados de conservação.
- **PDP-FR-007**: Lista `/produtos` exibe cards como links navegáveis para a PDP, indicando faixa de preço ("A partir de R$ ...") e tamanhos disponíveis.
- **CART-FR-001**: Sacola interativa em `/carrinho` lê itens locais e requisita cálculo do servidor via `POST /api/cart`.
- **CART-FR-002**: `POST /api/cart` valida cada item contra o catálogo publicado do servidor. Preços unitários e totais são calculados exclusivamente a partir dos dados do servidor, rejeitando qualquer manipulação no cliente.
- **CART-FR-003**: Variações esgotadas são sinalizadas na sacola com alerta visual.
- **CART-FR-004**: O usuário pode alterar quantidades (entre 1 e 10 por item) ou remover peças da sacola.
- **CART-FR-005**: Header reflete a quantidade total de peças na sacola de forma reativa.
- **CART-FR-006**: Avançar para checkout leva a `/checkout`, onde permanece o aviso de pré-abertura e o bloqueio de operações financeiras (503 `SALES_UNAVAILABLE`).

## Non-Functional Requirements

- **PDP-NFR-001**: Design responsivo (360px a desktop ultrawide), tipografia editorial, tokens do sistema e sem bibliotecas pesadas de terceiros.
- **PDP-NFR-002**: Metadata dinâmica por produto (title, description).
- **PDP-NFR-003**: Acessibilidade: suporte a navegação por teclado nos seletores de variante (radiogroup e botões com foco visível), links estruturais e breadcrumb.

## Acceptance Criteria

1. Given slug de camisa publicada, When acessar `/produtos/[slug]`, Then renderizar detalhes, fotos e variantes.
2. Given slug inexistente ou produto draft, When acessar `/produtos/[slug]`, Then retornar 404.
3. Given item com preço adulterado enviado para `/api/cart`, When calcular sacola, Then o servidor deve ignorar o preço enviado e aplicar o preço oficial do catálogo.
4. Given sacola vazia, When acessar `/carrinho`, Then exibir estado vazio elegante com link para a coleção.
