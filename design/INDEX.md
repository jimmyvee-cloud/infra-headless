# Design supplements index

**Canonical spec:** [`headless-cms-architecture.html`](../headless-cms-architecture.html) (repo root).  
**Rule:** Markdown here is **supplementary** until merged; if a supplement contradicts the HTML, **update the HTML** or mark the note as proposal-only.

| Document | Topic | Merge target (HTML section ids) | Status |
|----------|--------|----------------------------------|--------|
| [`one-table.md`](../one-table.md) | SK prefixes, GSI1 double duty, translation SK, PLATFORM, audit hot partition | `#dynamo`, `#gsi`, `#access-patterns` | Merged (audit + prefix callouts in HTML) |
| [`users-and-tennents.md`](../users-and-tennents.md) | UsersService, invites, `/me`, v1 revocation | `#users-service`, `#auth`, `#routers` | Merged |
| [`react-shell.md`](../react-shell.md) | Block contract, schema, merge, layouts | `#frontend-structure`, `#template-engine`, `#admin-panel` | Merged |
| [`templating-engine.md`](../templating-engine.md) | Typed BlockProps / PageMeta, repeater, block_list, recursive BlockRenderer, LayoutProps + nav | `#template-engine`, `#admin-panel`, `#frontend-structure` | Merged |

Add new rows when you create files under `headless-cms/` (or move notes into `design/`).

---

## Implementation phases (executable work — not done in doc pass)

Tracked for upcoming builds; **no code** in the broad alignment pass except the existing Docker scaffold.

1. **Data layer** — DynamoDB Local / LocalStack in compose; single-table client; PK/SK/GSI helpers per architecture.
2. **Core API** — Tenant + app middleware; GSI2 API-key path; delivery read (`slug → GSI1 → base Query`).
3. **Auth** — Argon2, JWT, refresh items; v1 revocation (refresh deletion; short access TTL).
4. **Management API** — Users/invites/roles per merged doc; pages CRUD + publish `TransactWrite`.
5. **Frontends** — Split public + admin Vite apps; `blockRegistry`, `layoutRegistry`, schema-driven admin.

Re-read supplements + HTML before each phase.
