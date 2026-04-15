# Como adicionar um novo template

Esta aplicação foi organizada para que **cada template seja auto-contido** em uma pasta e exista **um único ponto de registro**.

## Onde colocar o template

Crie uma nova pasta em:

- `app/lib/templates/templates/<template-id>/`

Dentro dela, siga o padrão:

- `types.ts`: tipos do `data` do template
- `definition.ts`: `meta`, `getExample()` e `render(data)`
- `Builder.tsx`: formulário + preview + código (cliente)

## Passo a passo

1. **Copie um template existente** (ex.: `attributes-strip`) para uma nova pasta.
2. **Defina o `id`** (string única) em `definition.ts` dentro de `meta.id`.
3. **Ajuste os tipos** em `types.ts` para o formato de dados que seu template precisa.
4. **Implemente `getExample()`** para retornar um exemplo realista (usado no preview da home).
5. **Implemente `render(data)`** para devolver `{ html, css? }` no formato de `RenderedTemplate`.
6. **Implemente o `Builder`** em `Builder.tsx` seguindo o padrão:
   - estado inicial com `getExample()`
   - `render(safeData)` para preview
   - `toSnippet(rendered)` para HTML/CSS copiáveis
7. **Registre no registry único**:
   - Abra `app/lib/templates/registry.ts`
   - Importe `meta/getExample/render/Builder` do novo template
   - Adicione no array `templateList`

## Checklist de qualidade

- O `id` é **único** e estável (não mudar depois que estiver em uso).
- `getExample()` não depende de rede.
- `render()` escapa entradas do usuário antes de inserir em HTML (use o mesmo padrão dos templates existentes).
- O Builder não quebra se URLs estiverem vazias (fallbacks/validação simples).

