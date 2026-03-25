# 🎓 Student Grade API — Microservices

Projet réalisé avec Node.js, Express, MongoDB, Docker et React.

## 🏗️ Architecture

```
student-grade-api/
├── auth-service/      → Port 3001 — Inscription, Connexion, JWT
├── student-service/   → Port 3002 — CRUD Étudiants & Matières
├── grade-service/     → Port 3003 — Notes & Bulletins
├── gateway/           → Port 3000 — Point d'entrée unique
├── frontend/          → Port 80   — Interface React
└── docker-compose.yml
```

## 🚀 Lancer le projet

### Prérequis
- Docker Desktop installé et lancé

### Commande unique
```bash
docker-compose up --build
```

Attendre que tous les services démarrent, puis ouvrir :
- **Frontend** → http://localhost
- **API Gateway** → http://localhost:3000

## 📡 Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /auth/register | Créer un compte |
| POST | /auth/login | Se connecter |
| GET | /students | Liste des étudiants |
| POST | /students | Créer un étudiant |
| GET | /students/:id | Détail d'un étudiant |
| PUT | /students/:id | Modifier un étudiant |
| DELETE | /students/:id | Supprimer un étudiant |
| GET | /subjects | Liste des matières |
| POST | /subjects | Créer une matière |
| DELETE | /subjects/:id | Supprimer une matière |
| POST | /grades | Ajouter une note |
| GET | /grades/bulletin/:studentId | Bulletin d'un étudiant |
| GET | /grades/subject/:subjectId | Notes par matière |

## 🧪 Tester avec curl

```bash
# 1. Créer un compte
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"123456"}'

# 2. Se connecter → copier le token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# 3. Créer un étudiant
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ali","lastName":"Hassan","email":"ali@test.com"}'

# 4. Créer une matière
curl -X POST http://localhost:3000/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"Mathématiques","coefficient":3}'

# 5. Ajouter une note (remplacer les IDs)
curl -X POST http://localhost:3000/grades \
  -H "Content-Type: application/json" \
  -d '{"studentId":"ID_ETUDIANT","subjectId":"ID_MATIERE","grade":15,"semester":"S1"}'

# 6. Voir le bulletin
curl http://localhost:3000/grades/bulletin/ID_ETUDIANT
```

## 🛑 Arrêter le projet
```bash
docker-compose down
```

## 🗑️ Tout supprimer (données incluses)
```bash
docker-compose down -v
```

## Technologies utilisées
- **Node.js** + **Express** — Backend microservices
- **MongoDB** — Base de données NoSQL
- **JWT** — Authentification sécurisée
- **Docker** + **Docker Compose** — Containerisation
- **React** — Frontend
- **Nginx** — Serveur web pour le frontend
