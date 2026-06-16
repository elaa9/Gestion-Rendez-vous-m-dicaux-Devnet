# Présentation MedFlow — Contenu des 7 Diapos

---

## Diapo 1 — Introduction (Titre)
**MedFlow : Système de Gestion de Rendez-vous Médicaux**

- Problématique : Gestion manuelle des rendez-vous médicaux (perte de temps, erreurs)
- Solution : Application web automatisée avec architecture DevOps
- Contexte : Projet DevNet & Automatisation
- Membres du groupe : [Vos noms]

---

## Diapo 2 — Stack Technique & Architecture

| Couche | Technologie |
|--------|------------|
| Backend | FastAPI (Python 3.12) |
| Frontend | Angular 17 |
| Base de données | MongoDB 7 |
| Conteneurisation | Docker & Docker Compose (3 services) |
| API externe | Nationalize.io |
| CI/CD | GitHub Actions |
| Automatisation | Bash + Ansible |

**Schéma d'architecture :**
```
 Browser → Nginx/Angular (:80) → FastAPI (:8000) → MongoDB (:27017)
                                       ↓
                                 Nationalize.io
```

---

## Diapo 3 — Backend Python (FastAPI)

- **Framework :** FastAPI (asynchrone, auto-documenté)
- **Authentification :** JWT (JSON Web Tokens) avec rôles secrétaire/médecin
- **CRUD complet :** Patients, Médecins, Rendez-vous
- **Validation :** Pydantic (email, dates, types)
- **Base de données :** MongoDB avec Motor (driver asynchrone)
- **Sécurité :** Mots de passe hachés (bcrypt), CORS configuré

Démo → `/docs` (Swagger UI automatique)

---

## Diapo 4 — Frontend Angular 17

- **Architecture :** Standalone Components (sans NgModules)
- **Design :** Glassmorphism (moderne, responsive)
- **Fonctionnalités :**
  - Dashboard avec statistiques et rendez-vous du jour
  - CRUD patients avec prédiction de nationalité (Nationalize.io)
  - Gestion des médecins et rendez-vous
  - Filtrage des rendez-vous par date
  - Changement de statut inline (Confirmé/Annulé/En attente)
- **Communication :** Service HTTP avec tokens JWT

---

## Diapo 5 — Docker & Automatisation

**Docker Compose (3 services) :**
```yaml
services:
  mongodb:    # MongoDB 7
  backend:    # FastAPI (Python 3.12-slim)
  frontend:   # Nginx (multi-stage build: node → nginx)
```

**Scripts d'automatisation :**
- `deploy.sh` → Build + Start + Seed (zéro intervention)
- `reset.sh` → Suppression complète + rebuild
- **Ansible :** Playbook pour déploiement sur serveur distant

**Optimisations Docker :**
- Multi-stage build (frontend : node → nginx)
- Installation des dépendances avant le code source (cache)
- Image Python slim (97% plus légère)

---

## Diapo 6 — CI/CD & Tests

**Pipeline GitHub Actions :**
1. Push → Tests backend (pytest)
2. Build images Docker
3. Validation docker-compose

**Tests automatisés (5 tests) :**
- Test racine (`/`)
- Health check (`/health`)
- API externe Nationalize.io (`/api/external/predict/{name}`)
- Documentation Swagger (`/docs`)
- Schéma OpenAPI (`/openapi.json`)

→ Résultat : ✅ 5/5 tests passent

---

## Diapo 7 — Démonstration

**Scénario de démo (5 min) :**

1. **Lancer l'application :** `./deploy.sh`
2. **Connexion :** admin / admin123
3. **Dashboard :** Statistiques, rendez-vous du jour
4. **Patients :** CRUD + bouton "Prédire nationalité"
5. **Rendez-vous :** Filtre par date, changement de statut
6. **API Docs :** Swagger UI avec endpoints
7. **CI/CD :** Montrer le badge GitHub Actions ✅

**Live URLs :**
- Frontend : http://localhost
- API Docs : http://localhost:8000/docs
- GitHub : https://github.com/elaa9/Gestion-Rendez-vous-m-dicaux-Devnet

---

## Questions possibles & Réponses

- **Pourquoi FastAPI ?** → Performance asynchrone, documentation auto-générée, validation Pydantic
- **Pourquoi MongoDB ?** → Schéma flexible pour les données médicales, scaling horizontal
- **Sécurité ?** → JWT + bcrypt + validation des entrées + CORS
- **Pourquoi Angular ?** → Architecture modulaire, TypeScript, écosystème complet
- **CI/CD ?** → GitHub Actions avec tests et build automatisés
- **API externe ?** → Nationalize.io (gratuit, sans clé API)
