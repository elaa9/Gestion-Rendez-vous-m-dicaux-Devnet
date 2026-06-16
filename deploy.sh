#!/bin/bash
set -e

echo "=========================================="
echo "  MedFlow - Déploiement Automatisé"
echo "=========================================="

echo ""
echo "[1/5] Vérification des prérequis..."
command -v docker >/dev/null 2>&1 || { echo "Erreur: Docker n'est pas installé."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Erreur: docker-compose n'est pas installé."; exit 1; }
echo "✓ Docker et docker-compose disponibles"

echo ""
echo "[2/5] Construction des images Docker..."
docker-compose build
echo "✓ Images construites avec succès"

echo ""
echo "[3/5] Démarrage des services..."
docker-compose up -d mongodb
echo "   Attente de MongoDB..."
sleep 5
docker-compose up -d backend
echo "✓ Backend démarré"
docker-compose up -d frontend
echo "✓ Frontend démarré"

echo ""
echo "[4/5] Initialisation de la base de données..."
docker-compose run --rm seed
echo "✓ Base de données initialisée"

echo ""
echo "[5/5] Vérification des services..."
sleep 3
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ API Health: OK"
else
    echo "⚠ API Health: en attente..."
fi

echo ""
echo "=========================================="
echo "  Déploiement terminé avec succès!"
echo "------------------------------------------"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo "=========================================="
echo ""
echo "Identifiants par défaut:"
echo "  Admin:    admin / admin123"
