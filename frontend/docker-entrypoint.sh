#!/bin/sh
set -e
cd /app
# Named volume can retain an old tree after package.json gains deps; re-install if anything required is missing.
if [ ! -d node_modules/react ] || [ ! -d node_modules/react-router-dom ] || [ ! -d node_modules/react-dom ]; then
  echo "Installing npm dependencies (first run, empty volume, or deps out of sync)..."
  npm install
fi
exec "$@"
