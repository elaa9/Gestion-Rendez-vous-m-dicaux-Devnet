# Présentation — Contenu des 7 Diapos

---

## Diapo 1 — Introduction

**Gestion de Rendez-vous Médicaux**

- **Problématique :** Les cliniques et cabinets médicaux gèrent encore les rendez-vous sur papier ou Excel → perte de temps, doublons, oublis
- **Solution :** Application web complète avec API REST, base de données, interface moderne et déploiement automatisé
- **Objectif :** Démontrer les compétences DevNet (DevOps, conteneurisation, CI/CD, automation)
- **Groupe :** [Vos noms]

---

## Diapo 2 — Architecture & Stack Technique

```
┌──────────────┐     ┌──────────────┐     ┌──────────┐
│   Navigateur │────▶│   Nginx      │────▶│  MongoDB │
│   (Angular)  │     │   FastAPI    │     │  :27017  │
│   :80        │     │   :8000      │     └──────────┘
└──────────────┘     └──────┬───────┘
                            │
                       ┌────▼───────┐
                       │Nationalize │
                       │   .io API  │
                       └────────────┘
```

| Couche | Technologie |
|--------|------------|
| Backend | **FastAPI** (Python 3.12) — asynchrone, auto-documenté |
| Frontend | **Angular 17** — Standalone Components, Glassmorphism |
| BDD | **MongoDB 7** — NoSQL, flexible |
| Conteneurisation | **Docker & Docker Compose** — 3 services |
| API Externe | **Nationalize.io** — prédiction de nationalité |
| CI/CD | **GitHub Actions** — tests + build automatiques |
| Automation | **Bash** (deploy.sh) + **Ansible** |

---

## Diapo 3 — Backend FastAPI

**Routes CRUD complètes :**

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| POST | `/api/auth/login` | Authentification JWT |
| POST | `/api/auth/register` | Inscription |
| GET/POST/PUT/DELETE | `/api/patients` | CRUD Patients |
| GET/POST/PUT/DELETE | `/api/medecins` | CRUD Médecins |
| GET/POST/PUT/DELETE | `/api/rendezvous` | CRUD Rendez-vous |
| GET | `/api/external/predict/{name}` | API Nationalize.io |

**Points clés :**
- ✅ Authentification JWT avec rôles (secrétaire, médecin)
- ✅ Validation Pydantic (EmailStr, dates, types stricts)
- ✅ Mots de passe hachés (bcrypt 4.0.1)
- ✅ Base de données asynchrone (Motor)
- ✅ Documentation Swagger automatique → `/docs`

---

## Diapo 4 — Frontend Angular 17

**Composants standalone (pas de NgModules) :**

- **LoginComponent** → Authentification avec token JWT
- **DashboardComponent** → Statistiques + rendez-vous du jour
- **PatientListComponent** → CRUD + bouton "Prédire nationalité" → appelle Nationalize.io
- **MedecinListComponent** → Liste des médecins avec spécialités
- **RendezVousListComponent** → Filtrage par date, changement de statut inline

**Design :** Glassmorphism (verre dépoli), responsive
**Communication :** ApiService avec tokens JWT dans les headers

---

## Diapo 5 — Docker & Automatisation

**Docker Compose — 3 services conteneurisés :**

| Service | Image | Port |
|---------|-------|------|
| `mongodb` | mongo:7 | 27017 |
| `backend` | Python 3.12-slim + uvicorn | 8000 |
| `frontend` | Node 20 → Nginx (multi-stage) | 80 |

**Optimisations :**
- Multi-stage build (frontend : dev → prod static)
- Cache Docker layer (dépendances avant code)
- Base image Python slim (petite taille)
- Seed profile pour initialiser la BDD

**Automatisation :**
- **`deploy.sh`** : build → start → seed (zéro intervention)
- **`reset.sh`** : down --volumes + rebuild complet
- **Ansible** : playbook pour déploiement sur serveur distant (Docker + git clone + compose)

---

## Diapo 6 — CI/CD & Tests

**GitHub Actions Pipeline :**
```yaml
on: push → branches: main, develop
jobs:
  backend-tests:    # pytest (5 tests)
  build:            # Docker images (backend + frontend)
```

**5 tests automatisés (pytest + httpx) :**
1. ✅ `GET /` → API running
2. ✅ `GET /health` → status healthy
3. ✅ `GET /api/external/predict/karim` → Nationalize.io response
4. ✅ `GET /docs` → Swagger UI
5. ✅ `GET /openapi.json` → Schéma OpenAPI valide

**Résultat :** Vert ✅ à chaque push sur GitHub

---

## Diapo 7 — Démonstration en Direct (5 min)

**Étape 1 — Lancer l'application :**
```bash
docker-compose build
docker-compose up -d
docker-compose run --rm seed
```
*(ou `./deploy.sh` sous Linux/Git Bash)*

**Étape 2 — Utilisation :**
1. Ouvrir http://localhost → Login : `admin` / `admin123`
2. **Dashboard** : voir les statistiques et rendez-vous du jour
3. **Patients** : ajouter un patient → cliquer "Prédire nationalité"
4. **Rendez-vous** : filtrer par date, changer le statut
5. **API** : ouvrir http://localhost:8000/docs → tester un endpoint

**Étape 3 — CI/CD :** Aller sur GitHub → Actions → montrer le badge vert

---

## Questions & Réponses types

| Question | Réponse |
|----------|---------|
| **Pourquoi FastAPI ?** | Asynchrone, documentation auto-générée, validation Pydantic intégrée |
| **Pourquoi MongoDB ?** | Schéma flexible pour données médicales, scaling facile avec Docker |
| **Sécurité ?** | JWT (tokens), bcrypt (hash), CORS configuré, validation Pydantic |
| **API externe ?** | Nationalize.io — gratuit, sans clé, prédiction de nationalité par nom |
| **Déploiement ?** | Docker Compose local + Ansible pour déploiement distant automatisé |
| **CI/CD ?** | GitHub Actions : push → tests → build, tout automatisé |
| **Difficultés ?** | Compatibilité bcrypt/passlib, double `/api` dans l'URL, timeout MongoDB au démarrage |
