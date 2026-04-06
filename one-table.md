<!--
  Supplement — Dynamo rationale snippets.
  Canonical: ../headless-cms-architecture.html (#dynamo, #gsi, #access-patterns).
  Audit scaling note merged into architecture § DynamoDB (callout).
-->

Click any GSI block for the query code behind it. A few things worth highlighting about the overall design:

**The SK prefix hierarchy is the core of the design.** Because every entity type within a tenant has a distinct SK prefix (`USER#`, `APP#`, `PAGE#`, `AUDIT#` etc.), you can list all entities of one type with a single `begins_with` Query on the base table without a GSI — no filter expressions needed, no wasted read capacity on wrong entity types. This also means adding a new entity type never requires a table change, just a new prefix convention.

**GSI1 serves double duty** via prefix convention on `G1PK`. Both the email lookup pattern (`TENANT#abc#alice@acme.com`) and the slug lookup pattern (`TENANT#abc#about-us`) live in the same index because they have structurally different enough prefixes that they never collide. This is deliberate — three GSIs is already meaningful cost; collapsing two lookup patterns into one index saves ~30% on GSI write costs.

**The Translation SK extending the Page SK** (`PAGE#id#LANG#en` extending `PAGE#id`) is the key structural decision that makes delivery fast. A single `Query(PK=TENANT#abc, SK begins_with PAGE#01HX...)` returns the page metadata item and every translation item in one DynamoDB call — no joins, no second requests, no N+1. The application code then picks the right locale from the result set.

**Platform users sit in a completely separate partition** (`PK = PLATFORM`) from tenant data. This means a super_admin login query never touches the tenant data partition at all, and there's no possible query that could accidentally return both tenant users and platform users in the same result set.

The one thing to revisit as you scale is the audit log partition. Writing frequent audit events to `PK = TENANT#abc` means a busy tenant concentrates both content writes and audit writes on the same partition key. If you expect very high write throughput on auditing, consider a separate `PK = AUDIT#abc` partition for audit items — same table, different key space, spreads the hot partition load.