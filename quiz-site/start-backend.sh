#!/bin/bash
# Script pour démarrer automatiquement le backend Node.js
cd "$(dirname "$0")"
export $(grep -v '^#' .env | xargs)
node backend.js
