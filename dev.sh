#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "Starting Folio (Tauri dev)..."
npm run tauri:dev
