"""Load published delivery pages from DynamoDB (one-table GSI1 slug index)."""

from __future__ import annotations

import os
from decimal import Decimal
from functools import lru_cache
from typing import Any

import boto3
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import BotoCoreError, ClientError

_TABLE = os.environ.get("DYNAMODB_TABLE", "infraguys-headless-cms")
_REGION = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1"


def table_name() -> str:
    return _TABLE


@lru_cache(maxsize=1)
def _deserializer() -> TypeDeserializer:
    return TypeDeserializer()


def _deserialize_item(raw: dict[str, Any]) -> dict[str, Any]:
    d = _deserializer()
    return {k: d.deserialize(v) for k, v in raw.items()}


def json_safe(obj: Any) -> Any:
    """Decimal -> int or float for JSON; recurse into list/dict."""
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    if isinstance(obj, list):
        return [json_safe(x) for x in obj]
    if isinstance(obj, dict):
        return {k: json_safe(v) for k, v in obj.items()}
    return obj


def normalize_slug(slug: str) -> str:
    s = slug.strip().strip("/")
    return "index" if s == "" else s


def normalize_tenant_id(tenant_id: str) -> str:
    return tenant_id.strip()


def gsi1_pk(tenant_id: str, slug: str) -> str:
    return f"TENANT#{tenant_id}#{normalize_slug(slug)}"


def tenant_pk(tenant_id: str) -> str:
    return f"TENANT#{tenant_id}"


def fetch_page_meta_by_slug(tenant_id: str, slug: str) -> dict[str, Any] | None:
    region = _REGION
    client = boto3.client("dynamodb", region_name=region)
    g1 = gsi1_pk(tenant_id, slug)
    try:
        resp = client.query(
            TableName=_TABLE,
            IndexName="GSI1",
            KeyConditionExpression="G1PK = :g1",
            ExpressionAttributeValues={":g1": {"S": g1}},
            Limit=2,
        )
    except (ClientError, BotoCoreError):
        raise
    items = resp.get("Items") or []
    if not items:
        return None
    return _deserialize_item(items[0])


def fetch_translation(tenant_id: str, page_id: str, locale: str) -> dict[str, Any] | None:
    client = boto3.client("dynamodb", region_name=_REGION)
    sk = f"PAGE#{page_id}#LANG#{locale}"
    try:
        resp = client.get_item(
            TableName=_TABLE,
            Key={
                "pk": {"S": tenant_pk(tenant_id)},
                "sk": {"S": sk},
            },
            ConsistentRead=False,
        )
    except (ClientError, BotoCoreError):
        raise
    raw = resp.get("Item")
    if not raw:
        return None
    return _deserialize_item(raw)


def fetch_tenant_config(tenant_id: str) -> dict[str, Any] | None:
    client = boto3.client("dynamodb", region_name=_REGION)
    try:
        resp = client.get_item(
            TableName=_TABLE,
            Key={
                "pk": {"S": tenant_pk(tenant_id)},
                "sk": {"S": "CONFIG"},
            },
            ConsistentRead=False,
        )
    except (ClientError, BotoCoreError):
        raise
    raw = resp.get("Item")
    if not raw:
        return None
    return _deserialize_item(raw)


def default_content_locale(tenant_id: str) -> str:
    cfg = fetch_tenant_config(tenant_id)
    if not cfg:
        return "en"
    loc = cfg.get("default_locale")
    if loc is None or str(loc).strip() == "":
        return "en"
    return str(loc).strip()


def fetch_tenant_meta(tenant_id: str) -> dict[str, Any] | None:
    client = boto3.client("dynamodb", region_name=_REGION)
    try:
        resp = client.get_item(
            TableName=_TABLE,
            Key={"pk": {"S": tenant_pk(tenant_id)}, "sk": {"S": "META"}},
            ConsistentRead=False,
        )
    except (ClientError, BotoCoreError):
        raise
    raw = resp.get("Item")
    if not raw:
        return None
    return _deserialize_item(raw)


def get_delivery_page(tenant_id: str, slug: str, locale: str) -> dict[str, Any] | None:
    tid = normalize_tenant_id(tenant_id)
    loc = locale.strip() or "en"
    meta = fetch_page_meta_by_slug(tid, slug)
    if not meta:
        return None
    page_id = meta.get("page_id")
    if not page_id:
        return None
    # Most tenants only store structural blocks once (e.g. LANG#en); UI copy is merged client-side.
    fallback_order = [loc, default_content_locale(tid), "en"]
    seen: set[str] = set()
    trans: dict[str, Any] | None = None
    for try_loc in fallback_order:
        if try_loc in seen:
            continue
        seen.add(try_loc)
        candidate = fetch_translation(tid, str(page_id), try_loc)
        if candidate and "blocks" in candidate:
            trans = candidate
            break
    if not trans:
        return None
    out = {
        "tenant_id": tid,
        "slug": meta.get("slug", normalize_slug(slug)),
        "template": meta.get("template", ""),
        "status": meta.get("status", ""),
        "published_at": meta.get("published_at", ""),
        "blocks": json_safe(trans["blocks"]),
    }
    return out
