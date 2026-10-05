# Como adicionar um novo template

Cada template é **auto-contido** em uma pasta e é registrado em **um único arquivo** (`app/lib/templates/registry2.ts`). Nenhum componente central (home, página do builder, preview) precisa mudar.

Para entender a arquitetura antes de começar, veja a seção "Arquitetura" do [README](../README.md).

## Onde colocar

```
app/lib/templates/templates/<template-id>/
├── types.ts        # tipo XxxData do template
├── definition.ts   # meta, getExample(), render(data)
└── Builder.tsx     # formulário + preview + código ("use client")
```

## Passo a passo

1. **Copie um template parecido** para a pasta nova. Referências:
   - `faq`: lista repetível (adicionar/subir/descer/remover) e CSS com comentário de cabeçalho
   - `image-text-feature`: campos simples, imagem e cor validada
   - `comparison-table`: tipos com união discriminada (`kind: "text" | "boolean"`)
2. **`types.ts`**: defina o formato de `XxxData`.
3. **`definition.ts`**:
   - `meta.id`: string única em kebab-case. Vira a URL `/builder/<id>`. **Não mude depois de publicado.**
   - `meta.name`, `meta.description`, `meta.category` (hoje existem "Produto" e "Conteudo")
   - `getExample()`: dados realistas, sem rede. Alimentam a vitrine e o estado inicial do formulário.
   - `render(data)`: retorna `{ html, css }` como strings. Use `escapeHtml` em textos e `escapeAttr` em atributos (copie as funções de um template existente).
4. **`Builder.tsx`**: exporte `XxxBuilder({ templateName })` seguindo o padrão:
   - `const [data, setData] = useState(() => getExample())`
   - `safeData` com `useMemo` aplicando fallbacks para campos vazios
   - `render(safeData)`, depois `toSnippet(rendered)`
   - `<BuilderTabs preview=... htmlPanel={<CodePanel .../>} cssPanel={<CodePanel .../>} enablePreviewModal />`
5. **Registre em `app/lib/templates/registry2.ts`**. Todas as mudanças ficam nesse arquivo:
   1. Importe `types`, `meta/getExample/render` e o `Builder` (e reexporte se quiser, como os demais).
   2. Adicione o `id` ao union type `TemplateId`.
   3. Adicione `{ meta, getExample, render, Builder }` ao array `templateList`.
   4. Adicione um `case "<id>"` no `switch` de `previewTemplate()`. Sem isso, o card da home mostra "Template não encontrado".
6. Rode `npm run dev`, confira o card na home e o builder em `/builder/<id>` (desktop e mobile). Depois rode `npm run lint` e `npm run build`.

## Convenções do HTML/CSS gerado

- Classes com prefixo **`wi-<nome>`** e elementos em BEM (`.wi-faq__item`), para não colidir com o CSS da loja.
- Cores e espaçamentos em **CSS custom properties** na classe raiz.
- Prefira HTML nativo a JS (ex.: `<details>/<summary>` para acordeão).
- Responsivo via `@media` no próprio CSS do template.

## Checklist de qualidade

- [ ] O `id` é **único** e estável. Em dev, o registry lança erro se houver duplicado.
- [ ] `getExample()` não depende de rede.
- [ ] `render()` é determinístico e escapa **toda** entrada do usuário (texto com `escapeHtml`, atributos com `escapeAttr`; cores/valores CSS validados, como `sanitizeHexColor` em `image-text-feature`).
- [ ] O Builder não quebra com campos vazios: URLs vazias omitem o `<img>` e listas vazias têm fallback.
- [ ] Imagens têm `alt` quando o conteúdo é informativo.
- [ ] Preview conferido em Desktop e Mobile (390px).
