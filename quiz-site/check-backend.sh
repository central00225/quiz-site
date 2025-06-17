#!/bin/bash
# Vérifie si le backend Node.js est en ligne sur le port 3001
if lsof -i :3001 | grep LISTEN > /dev/null; then
  echo "✅ Backend en ligne sur le port 3001."
else
  echo "❌ Backend NON démarré sur le port 3001."
fi
