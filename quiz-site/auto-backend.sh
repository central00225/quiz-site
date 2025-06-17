#!/bin/bash
# Surveille et relance automatiquement le backend Node.js si besoin
cd "$(dirname "$0")"
while true; do
  if ! lsof -i :3001 | grep LISTEN > /dev/null; then
    echo "[Auto] Backend non détecté, démarrage..."
    nohup node backend.js > backend.log 2>&1 &
    sleep 2
  else
    echo "[Auto] Backend OK. Vérification dans 30s..."
    sleep 30
  fi
done
