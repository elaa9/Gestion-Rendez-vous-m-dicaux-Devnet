# MedFlow - Système de Gestion de Rendez-vous Médicaux

Application complète de gestion des patients, médecins et rendez-vous médicaux avec architecture microservices conteneurisée.

## Stack Technique

| Couche      | Technologie                          |
|-------------|--------------------------------------|
| Backend     | FastAPI (Python 3.12)               |
| Frontend    | Angular 17 (Standalone API)          |
| Base de données | MongoDB 7                         |
| Conteneurisation | Docker & Docker Compose           |
| API Externe | REST Countries API                   |
| CI/CD       | GitHub Actions                       |
| IAC         | Ansible                              |

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│  Backend │────▶│ MongoDB  │
│ :80      │     │ :8000    │     │ :27017   │
└──────────┘     └────┬─────┘     └──────────┘
                      │
                 ┌────▼─────┐
                 │ REST     │
                 │ Countries│
                 │ API      │
                 └──────────┘
```

## Fonctionnalités

- **Authentification** sécurisée (JWT) avec rôles (secrétaire, médecin)
- **CRUD Patients** avec recherche, nationalité via API externe
- **CRUD Médecins** avec spécialités
- **CRUD Rendez-vous** avec filtrage par date, changement de statut
- **Dashboard** avec statistiques et rendez-vous du jour
- **Interface Glassmorphism** design moderne et responsive

## Déploiement Rapide (Docker)

```bash
# Lancer l'application complète
docker-compose up -d

# Initialiser la base de données avec des données de test
docker-compose run --rm seed

# Accès
# Frontend: http://localhost
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Déploiement Automatisé

```bash
# Script Bash
chmod +x deploy.sh && ./deploy.sh

# Ansible
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

## Identifiants par défaut

| Utilisateur | Mot de passe | Rôle       |
|-------------|-------------|------------|
| admin       | admin123    | secrétaire |
| drbenali    | medecin123  | médecin    |

## API Endpoints

| Méthode | Endpoint                | Description              |
|---------|------------------------|--------------------------|
| POST    | /api/auth/login        | Authentification         |
| POST    | /api/auth/register     | Inscription              |
| GET     | /api/patients          | Liste des patients       |
| POST    | /api/patients          | Créer un patient         |
| PUT     | /api/patients/{id}     | Modifier un patient      |
| DELETE  | /api/patients/{id}     | Supprimer un patient     |
| GET     | /api/medecins          | Liste des médecins       |
| POST    | /api/medecins          | Créer un médecin         |
| GET     | /api/rendezvous        | Liste des rendez-vous    |
| POST    | /api/rendezvous        | Créer un rendez-vous     |
| GET     | /api/external/countries| Liste des pays (API externe) |

## Scripts disponibles

```bash
./deploy.sh       # Déploiement complet automatisé
./reset.sh        # Réinitialisation complète (supprime les volumes)
docker-compose run --rm seed  # Initialiser les données de test
```

## Tests

```bash
cd backend
pip install -r requirements.txt
python -m pytest app/tests/ -v
```

## CI/CD

Pipeline GitHub Actions avec:
- Tests backend automatisés
- Construction des images Docker
- Validation de la configuration Docker Compose
"# Gestion-Rendez-vous-m-dicaux-Devnet" 
