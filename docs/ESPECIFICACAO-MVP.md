# Wi Templates — Especificação do MVP

## Contexto
Este projeto tem como objetivo **ajudar clientes a gerar HTML de campos/descrições de produto** a partir de **templates pré-definidos**, sem que o usuário final precise saber HTML/CSS.

O MVP **não terá login** e **não salvará dados**. O usuário escolhe um template, preenche um formulário, vê um preview e copia o HTML gerado para colar no próprio site/plataforma.

## Objetivos
- **Gerar HTML “copiar e colar”** a partir de dados estruturados (formulário).
- **Preview fiel** do resultado final.
- **Templates extensíveis** (adicionar novos templates com baixo atrito).
- **Boa UX** (claro, rápido, com validações e estados de erro).

## Não-objetivos (fora do escopo do MVP)
- Login, multiusuário, permissões.
- Salvar/recuperar projetos no servidor (banco de dados).
- Compartilhamento por link.
- Editor livre de HTML (WYSIWYG) com liberdade total de tags/scripts **inseridos pelo cliente**.

## Stack recomendada (alinhada ao repo)
- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS**
- **Formulários/validação**: React Hook Form + Zod (ou alternativa equivalente)
- **Preview**: renderização em **`<iframe>`** (isolamento) + sanitização se necessário
- **Botão de copiar**: `navigator.clipboard.writeText`

> Observação: o projeto já está inicializado com Next.js + TypeScript + Tailwind; o MVP pode ser todo client-side, sem back-end dedicado.

## Conceitos principais

### Template
Um **template** é um “molde” que define:
- **Metadados**: `id`, `nome`, `descrição`, `categoria`, `thumbnail` (opcional)
- **Schema do formulário**: **campos próprios do template** (tipos, validações, valores padrão)
- **Transformação**: como os dados do formulário viram HTML (e, opcionalmente, CSS/JS)
- **Opções de render** (se aplicável): ex. tema claro/escuro do template, variações de layout, etc.
- **Preview de vitrine**: capacidade de renderizar o template com **valores de exemplo/aleatórios** para ser exibido na seleção

O MVP deve permitir **adicionar templates sem reescrever o app** (ex.: por arquivo em `src/templates/*` ou `app/templates/*`).

### Projeto (estado em memória)
Mesmo sem “salvar”, o usuário precisa de um estado temporário:
- Template selecionado
- Valores do formulário
- HTML gerado

No MVP, esse estado pode viver apenas em memória (React state). Opcionalmente:
- **Persistência local**: `localStorage` (não é “salvar no servidor”, mas melhora UX em refresh acidental)

## Fluxo do usuário (end-to-end)

### 1) Seleção do template
**Tela/Seção**: “Escolha um template”
- Listar templates disponíveis (cards com nome/descrição).
- Em cada card, permitir visualizar uma **prévia do componente** usando **valores aleatórios (ou exemplos do template)**, para o usuário entender o resultado antes de escolher.
- Ação: clicar em “Usar este template”.

**Critérios de aceite**
- Usuário consegue entender rapidamente as opções.
- Trocar de template limpa ou reinterpreta o formulário de forma previsível.

### 2) Preenchimento do formulário
**Tela/Seção**: “Preencha as informações”
- Renderizar campos definidos pelo template (ex.: texto, número, select, imagem por URL).
- Mostrar validações (obrigatório, limites, formatos).
- Ideal: “campos inteligentes” (placeholders, exemplos, ajuda curta).

**Critérios de aceite**
- Erros de validação aparecem junto ao campo e impedem geração inválida.
- Campos obrigatórios ficam visíveis e claros.

### 3) Geração do HTML
**Ação**: botão “Gerar HTML” (ou geração automática conforme digita — decisão de produto)
- Converter os valores do formulário em HTML conforme regras do template.
- Exibir o HTML em um painel de “código” (readonly).

**Critérios de aceite**
- HTML gerado é estável e determinístico (mesmas entradas → mesmo HTML).
- O HTML não contém scripts arbitrários.

### 4) Preview
**Tela/Seção**: “Preview”
- Renderizar o HTML gerado em um **iframe** para isolar estilos.
- Ter alternância de visualização **Desktop / Mobile** (ex.: largura fixa para mobile e fluida para desktop).

**Critérios de aceite**
- Preview reflete o HTML gerado com boa fidelidade.
- Nenhum CSS global do app deve “vazar” para o preview.

### 5) Copiar HTML
**Ação**: botão “Copiar HTML”
- Copiar o HTML para a área de transferência.
- Feedback claro (toast/mensagem “Copiado”).

**Critérios de aceite**
- Funciona nos navegadores alvo (mínimo: Chrome/Edge modernos).
- Em caso de falha de permissões, exibir fallback (selecionar texto + instrução).

## Regras de geração de HTML (contrato)
O HTML final deve ser “colável” e previsível. Recomendações para o MVP:
- **Estilos (discussão/decisão do MVP)**:
  - Opção A: **CSS inline** no próprio HTML (maior compatibilidade ao colar em editores restritos, porém mais verboso).
  - Opção B: `<style>` embutido no snippet (mais limpo, porém depende do destino aceitar `<style>`).
  - Opção C (não recomendada no MVP): CSS externo por URL (introduz dependência e risco de quebra).
- **Scripts**:
  - O template **pode** incluir `<script>` e comportamento JS **pré-moldado**, desde que o cliente **não consiga inserir código arbitrário** (ele só preenche formulário).
  - Evitar dependências externas sempre que possível; se houver, devem ser explícitas e estáveis.
  - Se o destino onde o HTML será colado **bloquear scripts**, o template deve funcionar de forma degradada (somente apresentação) ou o template deve declarar “incompatível”.
- **Segurança**:
  - Mesmo sem edição livre, tratar campos de texto como dados (escapar/normalizar) para evitar injeções acidentais.
  - Não permitir que valores de formulário gerem atributos perigosos (ex.: `on*=`) ou URLs `javascript:`.
- **Imagens**: preferir URL HTTPS e atributos `alt`.
- **Acessibilidade mínima**: headings em ordem, links com texto útil, imagens com `alt`.

### Sanitização (quando aplicar)
- Se os campos forem *apenas texto simples* (sem HTML), o risco é baixo.
- Se existir campo “texto rico” (negrito, links, listas), aplicar sanitização do conteúdo do usuário **antes** de inserir no HTML final e no preview.

## Estrutura sugerida de templates (referência)
O objetivo aqui é orientar o formato, não travar implementação. Um template pode ser composto por:
- `meta`: informações de listagem
- `schema`: campos e validações
- `render(data)`: retorna `{ html, css?, js? }` ou diretamente `html`
- `getExampleData()`: retorna valores de exemplo (ou pseudoaleatórios) usados na vitrine/seleção e para “reset”

Campos comuns:
- `text` (string)
- `textarea` (string)
- `number` (number)
- `select` (enum)
- `imageUrl` (string URL)
- `repeater` (lista de itens) — opcional no MVP

## Componentes/páginas (visão de UI)
Sugestão de layout em 2 colunas (desktop):
- **Esquerda**: seleção do template + formulário
- **Direita**: tabs “Preview” e “HTML”

Estados importantes:
- Estado inicial (sem template selecionado)
- Formulário inválido (mensagens)
- HTML gerado (habilitar copiar)
- Erro ao copiar (fallback)

## Extensibilidade (adicionar novos templates)
Processo desejado para subir template novo:
1. Criar um arquivo de template com `id`, `meta`, `schema`, `render` (e `getExampleData` se aplicável).
2. Adicionar thumbnail (opcional).
3. O template aparece automaticamente na lista.

**Critério de aceite**
- Adicionar template novo deve ser um change pequeno e isolado, sem necessidade de alterar componentes centrais (no máximo, registrar/exportar o template).

## Qualidade e requisitos não-funcionais
- **Performance**: geração e preview devem ser instantâneos para inputs típicos.
- **Segurança**: evitar XSS (principalmente no preview e no HTML gerado).
- **Compatibilidade**: HTML/CSS gerado deve funcionar no destino típico do cliente (definir alvo: “sites que aceitam HTML no CMS”, “descrição de produto”, etc.).

## Perguntas em aberto (para fechar antes de implementação)
- Onde esse HTML será colado? (CMS próprio, VTEX, Shopify, WordPress, etc.)
- O destino aceita `<style>` embutido? Ou apenas HTML “puro”?
- Precisamos suportar “texto rico” ou apenas texto simples?
- Precisamos de variações por template (ex.: 2 layouts para o mesmo conteúdo)?

