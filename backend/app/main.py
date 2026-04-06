import os

from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.delivery_store import (
    fetch_tenant_meta,
    get_delivery_page,
    table_name,
)

DEFAULT_TENANT_ID = os.environ.get("DEFAULT_TENANT_ID", "infra_guys_website_main")


def _cors_allow_origins() -> list[str]:
    """Browser origins allowed to call this API. Merge defaults + CORS_ORIGINS (comma-separated)."""
    defaults = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://infra-guys.com",
        "https://www.infra-guys.com",
    ]
    extra = os.environ.get("CORS_ORIGINS", "").strip()
    if not extra:
        return defaults
    merged = defaults + [o.strip() for o in extra.split(",") if o.strip()]
    seen: set[str] = set()
    out: list[str] = []
    for o in merged:
        if o not in seen:
            seen.add(o)
            out.append(o)
    return out


app = FastAPI(title="Headless CMS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_allow_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    out: dict = {
        "status": "ok",
        "dynamo_table": table_name(),
    }
    try:
        meta = fetch_tenant_meta(DEFAULT_TENANT_ID)
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "ClientError")
        out["dynamo_ok"] = False
        out["dynamo_error"] = code
        return out
    except BotoCoreError as e:
        out["dynamo_ok"] = False
        out["dynamo_error"] = str(e)
        return out

    out["dynamo_ok"] = True
    if meta:
        out["active_tenant"] = {
            k: meta[k]
            for k in ("tenant_id", "subdomain", "status", "plan")
            if k in meta
        }
    return out


@app.get("/delivery/pages/{slug:path}")
def delivery_page(slug: str, tenant_id: str, locale: str = "en"):
    try:
        page = get_delivery_page(tenant_id, slug, locale)
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "ClientError")
        raise HTTPException(
            status_code=503,
            detail=f"DynamoDB error: {code}",
        ) from e
    except BotoCoreError as e:
        raise HTTPException(status_code=503, detail=f"AWS error: {e}") from e

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    return page
