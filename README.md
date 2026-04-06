# Headless CMS — local Docker dev

## Documentation (read this first)

| What | Where |
|------|--------|
| **Canonical architecture** (full system: API, DynamoDB, React, auth, v1 vs v2) | [`headless-cms-architecture.html`](../headless-cms-architecture.html) at repo root |
| **Supplements** (focused notes; merged into HTML over time) | [`one-table.md`](one-table.md), [`users-and-tennents.md`](users-and-tennents.md), [`react-shell.md`](react-shell.md), [`templating-engine.md`](templating-engine.md) |
| **Design index + implementation phases** | [`design/INDEX.md`](design/INDEX.md) |

**Precedence:** If anything in a `.md` file disagrees with `headless-cms-architecture.html`, **trust the HTML** unless you are explicitly prototyping — then mark the markdown as proposal and update the HTML when the design is settled.

**v1 vs v2:** Baseline runs on **DynamoDB + app logic** only. **Redis / ElastiCache** (shared cache, distributed rate limits, JTI blocklist) is **version 2** — see the dedicated callout in the architecture page.

---

## Docker

Scaffold referenced from the architecture page (section **Local development (Docker)**).

### Requirements

- Docker Engine + Docker Compose v2

### Run

```bash
cd headless-cms
docker compose up --build
```

- **API:** http://localhost:8800 — FastAPI + uvicorn `--reload` (host **8800** → container 8000 to avoid clashing with other local servers). Application code is mounted from `./backend/app`.
- **Frontend:** http://localhost:5174 by default — Vite in the container still listens on **5173**; the host maps **`${WEB_HOST_PORT:-5174}:5173`** so Compose does not fight a local Vite on 5173. `./frontend` is mounted at `/app`. **Company home**: http://localhost:5174/ — **Development services**: http://localhost:5174/services/dev-services.html — **API health dev shell**: http://localhost:5174/dev. To use host port **5173** instead, stop whatever is bound to 5173 and run e.g. `WEB_HOST_PORT=5173 docker compose up`.

To use different host ports, set **`WEB_HOST_PORT`** or edit `ports:` in `docker-compose.yml`.

### Volumes

| Host path | Service | Mount point | Purpose |
|-----------|---------|-------------|---------|
| `backend/app` | api | `/app/app` | Live Python source |
| `backend/requirements.txt` | api | `/app/requirements.txt` (ro) | Dependency manifest |
| `frontend` | web | `/app` | Live TS/React source |
| (named) `web_node_modules` | web | `/app/node_modules` | Isolated npm installs |

After changing `backend/requirements.txt`, rebuild the API image: `docker compose build api` (or `up --build`).

### Troubleshooting

- **Frontend shows API unreachable from the browser:** The sample `App.tsx` calls `http://localhost:8800/health` from the **browser**. Ensure the `api` container is up and your compose `ports` match (default **8800** on the host).
- **Stale node_modules:** `docker compose down -v` removes the named volume (forces a fresh `npm install` on next up).
