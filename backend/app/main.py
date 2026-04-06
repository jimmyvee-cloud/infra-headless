import os
from pathlib import Path

from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.delivery_store import (
    fetch_tenant_meta,
    get_delivery_page,
    table_name,
)

DEFAULT_TENANT_ID = os.environ.get("DEFAULT_TENANT_ID", "infra_guys_website_main")


def _credential_visibility() -> dict[str, bool]:
    """Non-secret booleans for /health — whether the container likely has AWS identity sources."""
    home = Path(os.environ.get("HOME", "/root"))
    return {
        "aws_access_key_in_env": bool(os.environ.get("AWS_ACCESS_KEY_ID", "").strip()),
        "aws_secret_access_key_in_env": bool(
            os.environ.get("AWS_SECRET_ACCESS_KEY", "").strip()
        ),
        "container_aws_credentials_file_exists": (home / ".aws" / "credentials").is_file(),
    }


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
    out.update(_credential_visibility())
    try:
        meta = fetch_tenant_meta(DEFAULT_TENANT_ID)
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "ClientError")
        out["dynamo_ok"] = False
        out["dynamo_error"] = code
        return out
    except BotoCoreError as e:
        msg = str(e)
        out["dynamo_ok"] = False
        out["dynamo_error"] = msg
        if "credentials" in msg.lower():
            out["dynamo_hint"] = (
                "Provide AWS credentials: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY "
                "(and AWS_SESSION_TOKEN if using temp keys), use an env_file in docker-compose, "
                "~/.aws on the host, or run on AWS with an IAM role that can access DynamoDB."
            )
            if (
                not out["aws_access_key_in_env"]
                and not out["container_aws_credentials_file_exists"]
            ):
                out["dynamo_hint"] += (
                    " Your /health shows no key in env and no ~/.aws/credentials in the container — "
                    "put keys in `.env` next to docker-compose.yml (or rely on the compose `~/.aws` mount), "
                    "then `docker compose up -d --force-recreate api`. `docker exec` cannot inject "
                    "credentials into an already-running uvicorn process."
                )
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
