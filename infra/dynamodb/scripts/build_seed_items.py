#!/usr/bin/env python3
"""Build DynamoDB JSON item files from generated block payloads + run aws dynamodb put-item."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from marshall import write_item  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"

TENANT_ID = "infra_guys_website_main"
PK = f"TENANT#{TENANT_ID}"
PAGE_HOME_ID = "01JG9HOME0001"
PAGE_DEV_ID = "01JG9DEVSVC001"
PAGE_DEPLOY_ID = "01JG9DEPLOY001"
PAGE_AUTO_ID = "01JG9AUTO001"
PUBLISHED_HOME_AT = "2026-04-06T12:00:00.000Z"
PUBLISHED_DEV_AT = "2026-04-06T12:01:00.000Z"
PUBLISHED_DEPLOY_AT = "2026-04-06T12:02:00.000Z"
PUBLISHED_AUTO_AT = "2026-04-06T12:03:00.000Z"


def load_blocks(name: str) -> list:
    with open(GEN / name, encoding="utf-8") as f:
        return json.load(f)


def items() -> list[dict]:
    home_blocks = load_blocks("home-blocks.json")
    dev_blocks = load_blocks("dev-services-blocks.json")
    deployment_blocks = load_blocks("deployment-blocks.json")
    automation_blocks = load_blocks("automation-blocks.json")

    return [
        {
            "pk": PK,
            "sk": "META",
            "entity": "tenant_meta",
            "tenant_id": TENANT_ID,
            "subdomain": TENANT_ID,
            "plan": "starter",
            "status": "active",
            "G3PK": "PLATFORM#active",
            "G3SK": f"2026-04-01T00:00:00.000Z#{TENANT_ID}",
        },
        {
            "pk": PK,
            "sk": "CONFIG",
            "entity": "tenant_config",
            "default_locale": "en",
            "timezone": "UTC",
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_HOME_ID}",
            "entity": "page_meta",
            "page_id": PAGE_HOME_ID,
            "tenant_id": TENANT_ID,
            "slug": "index",
            "template": "infra_home_marketing",
            "status": "published",
            "published_at": PUBLISHED_HOME_AT,
            "locales": ["en", "th", "ar"],
            "version": 1,
            "G1PK": f"TENANT#{TENANT_ID}#index",
            "G1SK": f"PAGE#{PAGE_HOME_ID}",
            "G2PK": f"TENANT#{TENANT_ID}#published",
            "G2SK": f"{PUBLISHED_HOME_AT}#{PAGE_HOME_ID}",
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_HOME_ID}#LANG#en",
            "entity": "page_translation",
            "page_id": PAGE_HOME_ID,
            "tenant_id": TENANT_ID,
            "locale": "en",
            "slug": "index",
            "version": 1,
            "blocks": home_blocks,
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_DEV_ID}",
            "entity": "page_meta",
            "page_id": PAGE_DEV_ID,
            "tenant_id": TENANT_ID,
            "slug": "services/dev-services.html",
            "template": "dev_services_marketing",
            "status": "published",
            "published_at": PUBLISHED_DEV_AT,
            "locales": ["en", "th", "ar"],
            "version": 1,
            "G1PK": f"TENANT#{TENANT_ID}#services/dev-services.html",
            "G1SK": f"PAGE#{PAGE_DEV_ID}",
            "G2PK": f"TENANT#{TENANT_ID}#published",
            "G2SK": f"{PUBLISHED_DEV_AT}#{PAGE_DEV_ID}",
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_DEV_ID}#LANG#en",
            "entity": "page_translation",
            "page_id": PAGE_DEV_ID,
            "tenant_id": TENANT_ID,
            "locale": "en",
            "slug": "services/dev-services.html",
            "version": 1,
            "blocks": dev_blocks,
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_DEPLOY_ID}",
            "entity": "page_meta",
            "page_id": PAGE_DEPLOY_ID,
            "tenant_id": TENANT_ID,
            "slug": "services/deployment.html",
            "template": "deployment_services_marketing",
            "status": "published",
            "published_at": PUBLISHED_DEPLOY_AT,
            "locales": ["en", "th", "ar"],
            "version": 1,
            "G1PK": f"TENANT#{TENANT_ID}#services/deployment.html",
            "G1SK": f"PAGE#{PAGE_DEPLOY_ID}",
            "G2PK": f"TENANT#{TENANT_ID}#published",
            "G2SK": f"{PUBLISHED_DEPLOY_AT}#{PAGE_DEPLOY_ID}",
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_DEPLOY_ID}#LANG#en",
            "entity": "page_translation",
            "page_id": PAGE_DEPLOY_ID,
            "tenant_id": TENANT_ID,
            "locale": "en",
            "slug": "services/deployment.html",
            "version": 1,
            "blocks": deployment_blocks,
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_AUTO_ID}",
            "entity": "page_meta",
            "page_id": PAGE_AUTO_ID,
            "tenant_id": TENANT_ID,
            "slug": "services/automation.html",
            "template": "automation_services_marketing",
            "status": "published",
            "published_at": PUBLISHED_AUTO_AT,
            "locales": ["en", "th", "ar"],
            "version": 1,
            "G1PK": f"TENANT#{TENANT_ID}#services/automation.html",
            "G1SK": f"PAGE#{PAGE_AUTO_ID}",
            "G2PK": f"TENANT#{TENANT_ID}#published",
            "G2SK": f"{PUBLISHED_AUTO_AT}#{PAGE_AUTO_ID}",
        },
        {
            "pk": PK,
            "sk": f"PAGE#{PAGE_AUTO_ID}#LANG#en",
            "entity": "page_translation",
            "page_id": PAGE_AUTO_ID,
            "tenant_id": TENANT_ID,
            "locale": "en",
            "slug": "services/automation.html",
            "version": 1,
            "blocks": automation_blocks,
        },
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--table", default="infraguys-headless-cms")
    parser.add_argument(
        "--write",
        action="store_true",
        help="Run aws dynamodb put-item for each generated file",
    )
    args = parser.parse_args()

    out_dir = ROOT / "items"
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        load_blocks("home-blocks.json")
        load_blocks("dev-services-blocks.json")
        load_blocks("deployment-blocks.json")
        load_blocks("automation-blocks.json")
    except FileNotFoundError:
        print(
            "Missing generated/*.json — run from repo:\n"
            "  cd headless-cms/frontend && npx tsx … (see README in infra/dynamodb)",
            file=sys.stderr,
        )
        sys.exit(1)

    paths: list[Path] = []
    for i, item in enumerate(items()):
        p = out_dir / f"item-{i:02d}-{item['sk'].replace('#', '-')}.json"
        write_item(str(p), item)
        paths.append(p)
        print("wrote", p)

    if args.write:
        for p in paths:
            cmd = [
                "aws",
                "dynamodb",
                "put-item",
                "--table-name",
                args.table,
                "--item",
                f"file://{p.resolve()}",
            ]
            print(" ".join(cmd))
            subprocess.run(cmd, check=True)


if __name__ == "__main__":
    main()
