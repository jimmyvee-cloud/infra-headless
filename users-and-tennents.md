<!--
  Supplement — not the canonical spec.
  Canonical: ../headless-cms-architecture.html (#users-service, #auth, #routers).
  GSI naming: use GSI1 / G1PK / G1SK in code to match the architecture doc (not “GSI_EMAIL”).
-->

# Users, tenants, and invites

Users are always scoped to a tenant. The same email in two tenants is two different records. Login uses **GSI1** with `G1PK = TENANT#{tenant_id}#{email_lower}`.

Two populations share the same auth mechanism but different partitions: **tenant admins/editors** (`PK = TENANT#…`) and **platform users** (`PK = PLATFORM`) for `super_admin`.

## UsersService (core methods)

```python
class UsersService:
    async def get_by_email(self, tenant_id: str, email: str) -> dict | None:
        result = await dynamo.query(
            index="GSI1",
            pk=f"TENANT#{tenant_id}#{email.lower()}",
            limit=1,
        )
        return result[0] if result else None

    async def list(self, tenant_id: str, cursor: str | None, limit: int = 50) -> PagedResult:
        return await dynamo.query(
            pk=f"TENANT#{tenant_id}",
            sk_begins_with="USER#",
            cursor=cursor,
            limit=limit,
        )

    async def get(self, tenant_id: str, user_id: str) -> dict:
        item = await dynamo.get(pk=f"TENANT#{tenant_id}", sk=f"USER#{user_id}")
        if not item:
            raise HTTPException(404, "User not found")
        return item

    async def update_role(self, tenant_id, target_user_id, new_role, actor_id, actor_role) -> dict:
        # Cannot assign role >= actor; cannot change own role; must keep ≥1 admin
        # ... then _revoke_user_sessions(tenant_id, target_user_id)
        ...

    async def deactivate(self, tenant_id, target_user_id, actor_id, actor_role) -> None:
        # ... then _revoke_user_sessions
        ...
```

### Invite / accept

- `invite`: role cap, duplicate email check, plan limit; `INVITE#{sha256(token)}` item with TTL; email sends **raw** token only.
- `accept_invite`: validate pending + TTL; **TransactWrite**: Put `USER#…` (with `G1PK`/`G1SK` for GSI1) + Delete invite.

On user **Put**, set projection attributes for GSI1 (e.g. `G1PK`, `G1SK`) consistently with the schema table in the architecture doc.

### Session revocation (v1 — no Redis)

```python
async def _revoke_user_sessions(self, tenant_id: str, user_id: str) -> None:
    refresh_tokens = await dynamo.query(
        pk=f"TENANT#{tenant_id}",
        sk_begins_with=f"REFRESH#{user_id}#",
    )
    for rt in refresh_tokens:
        await dynamo.delete(pk=f"TENANT#{tenant_id}", sk=rt["SK"])
```

Access JWTs remain valid until they expire (keep TTL short, e.g. 15–60 min). **v2:** optional Redis `jti:*` blocklist for immediate revocation — see architecture **Version 2 — caching layer** callout.

### require_role

Use as `Depends(require_role("editor"))`; reads `request.state.role` (no extra DB round-trip).

### `/manage/users/me`

- `GET /me` — `users_service.get(tenant_id, request.state.user_id)`
- `PATCH /me/password` — change password, then `_revoke_user_sessions` for the same user (force re-login elsewhere)

## Security

- **Last-admin** / role guards: count active admins with a **Query + FilterExpression** at write time — not a cached aggregate.
- **Invite**: only the hash lives in DynamoDB; raw token exists only in email and browser during accept.

**Merge status:** content reflected in `headless-cms-architecture.html` § Users & roles; keep this file for narrative and code sketches.

**Impact:** schema (GSI1 keys on user items), API (`UsersService`, `/me`), auth (refresh deletion). **Merge target:** `#users-service`, `#auth`, `#routers`.
