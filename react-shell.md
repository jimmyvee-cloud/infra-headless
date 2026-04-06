<!--
  Supplement — UI / delivery merge notes.
  Canonical: ../headless-cms-architecture.html (#frontend-structure, #template-engine, #admin-panel).
  Redis / ElastiCache: v2 only; see architecture page “Version 2 — caching layer”.
-->

# React shell: blocks, schema, layouts, delivery merge

## Block component contract

Every block shares props: `id`, `order`, `props`. Schema from `GET /delivery/blocks/schema` defines fields, types, and `translatable`. Blocks are **pure**: no fetching, no side effects, no layout decisions — data in, markup out.

## Schema-driven admin (`BlockForm`)

`BlockForm` iterates `fields`, picks widgets by `type`, locks fields when `translatable: false` and locale ≠ EN. Example hero schema:

```typescript
{
  type: "hero",
  label: "Hero banner",
  fields: [
    { name: "heading",    type: "text",     translatable: true,  required: true  },
    { name: "subheading", type: "textarea", translatable: true,  required: false },
    { name: "cta_label",  type: "text",     translatable: true,  required: true  },
    { name: "cta_url",    type: "url",      translatable: false, required: true  },
    { name: "image_key",  type: "media",    translatable: false, required: false },
  ]
}
```

## Delivery merge (EN overlay)

1. Load page meta  
2. Load EN translation (structural source)  
3. Load requested locale if present  
4. Per block: translatable props → locale then EN; **non-translatable always from EN**  
5. Sort by `order`, return `DeliveryPage`

## Template vs blocks

`page.template` selects the **layout shell** via `layoutRegistry`, not which blocks render. Two registries: `blockRegistry` (type → block) and `layoutRegistry` (template → layout).

```typescript
// pages/[slug].tsx
const { data: page } = usePage(slug)
const Layout = layoutRegistry[page.template] ?? DefaultLayout

return (
  <Layout page={page}>
    <PageRenderer blocks={page.blocks} />
  </Layout>
)
```

## Operational hot spots

- **`order`**: integers only; renumber 0…n after drag (no `2.5`).  
- **Saves**: replace whole `blocks[]` per locale; version/optimistic lock; debounce admin saves.  
- **Block `id`**: stable across locales; delete in EN removes block everywhere.

**Merge status:** folded into `headless-cms-architecture.html` §02–04.  
**Impact:** frontend, delivery API merge logic, admin editor. **Merge target:** `#frontend-structure`, `#template-engine`, `#admin-panel`.
