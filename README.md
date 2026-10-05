# WiTemplates

Gerador de HTML/CSS para **descrições de produto** (e-commerce). O usuário escolhe um template, preenche um formulário, vê o preview (desktop/mobile) e **copia o HTML e o CSS** para colar na plataforma (CMS, VTEX, Shopify etc.).

- Sem login, sem banco, sem back-end: tudo roda no navegador, com o estado em memória (React state).
- Atualizar a página descarta o que foi preenchido. Isso é esperado no MVP.

## Documentação

| Documento | Conteúdo |
|---|---|
| Este README | Visão geral, como rodar, arquitetura, convenções, pendências |
| [docs/ADDING_TEMPLATES.md](docs/ADDING_TEMPLATES.md) | Passo a passo para criar um template novo |
| [docs/ESPECIFICACAO-MVP.md](docs/ESPECIFICACAO-MVP.md) | Especificação original do produto (objetivos, fluxo, regras de geração de HTML) |
| [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md) | Instruções para agentes de IA (Claude Code, Cursor etc.) |

## Stack

- **Next.js 16.2** (App Router) + **React 19.2** + **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`, config dentro de `app/globals.css`, sem `tailwind.config`)
- **ESLint 9** (`eslint-config-next`)
- Fonte Geist via `next/font/google`
- Nenhuma outra dependência de runtime

> ⚠️ O Next.js 16 tem mudanças incompatíveis com versões anteriores (ex.: `params` em páginas dinâmicas é uma `Promise`). Antes de mexer em APIs do Next, consulte `node_modules/next/dist/docs/`.

## Como rodar

Requisitos: Node.js 20+ (testado com Node 24) e npm.

```bash
npm ci
```

```bash
npm run dev
```

Abra http://localhost:3000.

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (também roda a checagem de tipos) |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |

Não existem variáveis de ambiente, testes automatizados nem CI configurados. Deploy: qualquer host de Next.js (Vercel é o caminho mais simples). Não existe configuração de deploy no repositório.

## Rotas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `app/page.tsx` | Vitrine: grid de cards com preview de cada template (usando os dados de exemplo) |
| `/builder` | `app/builder/page.tsx` | Apenas redireciona para `/` |
| `/builder/[templateId]` | `app/builder/[templateId]/page.tsx` | Editor do template: formulário à esquerda, abas Preview / HTML / CSS à direita. `id` inexistente retorna 404 |

## Estrutura de pastas

```
app/
├── layout.tsx                 # Layout raiz (fontes, metadata, lang pt-BR)
├── page.tsx                   # Home / vitrine de templates
├── globals.css                # Tokens de cor (Tailwind 4 @theme) + utilitários (.glass, .card-premium, animações)
├── components/                # Componentes compartilhados da aplicação
│   ├── AppHeader.tsx          # Header fixo com logo (public/logo.png)
│   ├── TemplateCard.tsx       # Card da vitrine (preview + link para o builder)
│   ├── PreviewFrame.tsx       # <iframe srcDoc> isolado que renderiza { html, css, js }
│   ├── ResponsiveToggle.tsx   # Alternância Desktop / Mobile
│   └── CodePanel.tsx          # Painel de código com botão "Copiar" (navigator.clipboard)
├── builder/
│   ├── page.tsx               # Redirect para /
│   └── [templateId]/
│       ├── page.tsx           # Busca o template no registry e renderiza o Builder dele
│       └── tabs.tsx           # BuilderTabs: abas Preview/HTML/CSS + modal de tela cheia
└── lib/templates/
    ├── types.ts               # TemplateMeta e RenderedTemplate ({ html, css?, js? })
    ├── toSnippet.ts           # Normaliza (trim) o HTML/CSS que vai para os painéis de cópia
    ├── templateDefinition.ts  # Tipo genérico TemplateDefinition<TData> (hoje não é importado)
    ├── registry2.ts           # ★ REGISTRO ÚNICO de todos os templates
    └── templates/
        └── <template-id>/
            ├── types.ts       # Formato dos dados do template
            ├── definition.ts  # meta + getExample() + render(data)
            └── Builder.tsx    # Formulário + BuilderTabs (client component)
```

## Arquitetura: como um template funciona

Cada template é **auto-contido** em `app/lib/templates/templates/<id>/` e tem três peças:

1. **`definition.ts`** (funções puras, sem React):
   - `meta`: `{ id, name, description, category }`. O `id` vira a URL `/builder/<id>`.
   - `getExample()`: dados de exemplo. Alimentam o preview da vitrine e o estado inicial do formulário. Não podem depender de rede.
   - `render(data)`: devolve `{ html, css }` como **strings**. É determinístico: mesma entrada, mesma saída. Todo texto do usuário passa por `escapeHtml` / `escapeAttr`.
2. **`types.ts`**: o tipo `XxxData` que `getExample` retorna e `render` recebe.
3. **`Builder.tsx`** (`"use client"`):
   - `useState(getExample)` guarda os dados do formulário.
   - Um `safeData` (via `useMemo`) aplica fallbacks para campos vazios. Ex.: no FAQ, título vazio vira "FAQ" e lista vazia ganha 1 item.
   - `render(safeData)` gera o resultado e `toSnippet(...)` produz os textos que vão para os painéis de cópia.
   - O layout usa `<BuilderTabs preview=... htmlPanel={<CodePanel/>} cssPanel={<CodePanel/>} enablePreviewModal />`.
   - Listas repetíveis (itens, perguntas, linhas) têm Adicionar / Subir / Descer / Remover, com um array paralelo de IDs (`crypto.randomUUID()`) usado como `key`.

### Fluxo de dados

```
getExample() ──► useState(data) ──► formulário edita data
                                          │
                                   safeData (fallbacks)
                                          │
                                   render(safeData) ──► { html, css }
                                          │                     │
                                 PreviewFrame (iframe)    toSnippet ──► CodePanel (copiar)
```

### Registro (`registry2.ts`)

É o único arquivo central que muda quando entra um template novo. Ele exporta:

- `templateList`: array com `{ meta, getExample, render, Builder }` de cada template
- `templates`: só os `meta` (usado na home)
- `templateById`: mapa `id → definição` (usado em `/builder/[templateId]`)
- `TemplateId`: union type com os ids
- `previewTemplate(meta)`: `switch` que renderiza o exemplo de cada template para a vitrine
- Em desenvolvimento, lança erro se houver `id` duplicado

> O nome `registry2.ts` é histórico. Não existe `registry.ts`.

### Preview isolado

`PreviewFrame` monta um documento HTML completo (reset básico + `<style>{css}</style>` + `html` + `<script>{js}</script>` opcional) e o injeta via `srcDoc` em um `<iframe sandbox="allow-scripts allow-forms allow-popups allow-modals">`. Assim o CSS da aplicação não vaza para o preview e o CSS do template não vaza para a aplicação.

## Templates existentes

| id | Nome | Categoria | Dados principais |
|---|---|---|---|
| `attributes-strip` | Atributos (scroll) | Produto | lista de `{ iconUrl, label }` em faixa horizontal com scroll |
| `contains-compare` | Contém / Não contém | Produto | imagem central + duas listas (contém / não contém) |
| `attributes-details-bar` | Atributos + Details (barra) | Produto | atributos com ícone + acordeões `<details>` |
| `comparison-table` | Tabela comparativa | Produto | marca vs. concorrente; linhas com valor texto ou booleano; cabeçalho em texto ou logo |
| `faq` | FAQ | Conteudo | título + perguntas em acordeão, divididas em 2 colunas (1 no mobile) |
| `image-text-feature` | Imagem + Texto (destaque) | Conteudo | imagem + painel colorido (cor validada como hex) com título e descrição |

## Convenções do HTML/CSS gerado

Ao criar ou alterar templates, siga o padrão dos existentes:

- **Prefixo `wi-`** em todas as classes, uma classe raiz por template (ex.: `.wi-faq`), com elementos no estilo BEM (`.wi-faq__item`). Isso evita colisão com o CSS da loja onde o HTML será colado.
- Personalização visual via **CSS custom properties** na raiz do template (ex.: `--wi-faq-title`). Todos usam, exceto `comparison-table`.
- CSS entregue **separado** do HTML (aba CSS). O `faq` traz um comentário de cabeçalho identificando o template. Recomendo seguir esse padrão nos próximos.
- Interatividade sem JS sempre que possível: os acordeões usam `<details>/<summary>` nativos. Nenhum template atual usa `js`.
- Responsivo via `@media (max-width: ...)` no próprio CSS do template. O `attributes-strip` resolve com scroll horizontal e não tem media query.
- Ícones são SVG inline ou URL de imagem informada pelo usuário.
- **Segurança:** todo texto do usuário passa por `escapeHtml`, e todo valor que vai em atributo (ex.: `src`) passa por `escapeAttr`. Cores passam por validação (`sanitizeHexColor` em `image-text-feature`).

## Design system da aplicação (não dos templates)

- Tokens de cor em `:root` de `app/globals.css`, expostos ao Tailwind via `@theme inline` (`bg-background`, `text-muted-foreground`, `border-border` etc.). Só existe tema claro.
- Classes utilitárias próprias em `globals.css`: `.glass`, `.card-premium`, `.btn-press`, `.scrollbar-subtle`, `.animate-fade-in-up`, entre outras.
- Os formulários dos Builders usam classes Tailwind diretas (`zinc-*`, `black/10`), não os tokens. Vale padronizar quando houver oportunidade.

## Pendências e débitos técnicos conhecidos

Estado em 05/10/2026: `npm run build` passa e `npm run lint` mostra 0 erros e 1 warning.

1. **`tabs.tsx` mora no lugar errado:** `BuilderTabs` é compartilhado por todos os Builders, mas fica em `app/builder/[templateId]/tabs.tsx`. Por isso aparecem imports como `../../../../builder/[templateId]/tabs`. O lugar natural seria `app/components/`.
2. **`escapeHtml` / `escapeAttr` duplicados** em cada `definition.ts` (6 cópias). Poderiam virar um helper em `app/lib/templates/`.
3. **Registrar um template exige 3 edições em `registry2.ts`** (`templateList`, `TemplateId` e o `switch` de `previewTemplate`). O `switch` poderia ser trocado por `t.render(t.getExample())`.
4. **`templateDefinition.ts`** define `TemplateDefinition<TData>`, mas não é usado: o registry usa um tipo próprio, `TemplateDefinitionAny`.
5. **Warning de lint:** `isHovered` não usado em `CodePanel.tsx`.
6. **URLs de imagem** são escapadas, mas o esquema não é validado (aceita `http:` e `data:`, não exige `https:`). A spec pede preferência por HTTPS.
7. **`alt` vazio** nas imagens de quase todos os templates. Só `image-text-feature` tem campo de `alt`.
8. **Sem validação de formulário:** não há mensagens de erro por campo. A spec sugeria React Hook Form + Zod; hoje existem apenas fallbacks em `safeData`.
9. **Sem testes automatizados.** O alvo mais valioso seria testar as funções `render()` (puras e determinísticas), por exemplo com snapshot e com verificação de escape de `<script>`.
10. **Perguntas em aberto da spec** (destino do HTML, aceitação de `<style>`, texto rico) ainda não têm resposta registrada. Ver a seção final de `docs/ESPECIFICACAO-MVP.md`.
11. **Restos do create-next-app em `public/`** (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) não são usados.

## Histórico

| Commit | O que entrou |
|---|---|
| `fbba9e4` | Projeto criado com create-next-app |
| `8dd1c41` | Primeiros templates de produto + estrutura de builder |
| `741c978` | Melhorias de UI |
| `4b6524d` | Correções de lint/TypeScript |
| `3f8752e` | Template `faq` |
| `292ceb1` | Template `image-text-feature` |
