#!/bin/bash
set -e

echo "=========================================="
echo "  MedFlow - Réinitialisation Complète"
echo "=========================================="

echo ""
echo "Arrêt des services..."
docker-compose down -v

echo ""
echo "Reconstruction des images..."
docker-compose build --no-cache

echo ""
echo "Démarrage des services..."
docker-compose up -d mongodb
sleep 5
docker-compose up -d backend frontend

echo ""
echo "Initialisation de la base de données..."
docker-compose run --rm seed

echo ""
echo "✓ Réinitialisation terminée!"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8000"
