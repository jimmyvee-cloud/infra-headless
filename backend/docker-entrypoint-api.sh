#!/bin/sh
set -e
if [ -z "${AWS_ACCESS_KEY_ID:-}" ] && [ ! -f /root/.aws/credentials ]; then
  echo "cms-api: warning: AWS_ACCESS_KEY_ID is unset and /root/.aws/credentials is missing — DynamoDB calls will fail unless the runtime supplies credentials (e.g. EC2/ECS task IAM role)."
fi
exec "$@"
