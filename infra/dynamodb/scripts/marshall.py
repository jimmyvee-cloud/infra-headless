"""Plain Python values -> DynamoDB AttributeValue map (for aws dynamodb put-item --item)."""


def to_dynamo(v):  # noqa: ANN001
    if v is None:
        return {"NULL": True}
    if isinstance(v, bool):
        return {"BOOL": v}
    if isinstance(v, int):
        return {"N": str(v)}
    if isinstance(v, float):
        return {"N": repr(v)}
    if isinstance(v, str):
        return {"S": v}
    if isinstance(v, list):
        return {"L": [to_dynamo(x) for x in v]}
    if isinstance(v, dict):
        return {"M": {k: to_dynamo(val) for k, val in v.items()}}
    raise TypeError(f"Unsupported type: {type(v)!r}")


def item_to_put_json(item: dict) -> dict:
    """Top-level attrs for aws dynamodb put-item --item file://..."""
    return {k: to_dynamo(v) for k, v in item.items()}


def write_item(path: str, item: dict) -> None:
    import json

    with open(path, "w", encoding="utf-8") as f:
        json.dump(item_to_put_json(item), f, indent=2)
        f.write("\n")
