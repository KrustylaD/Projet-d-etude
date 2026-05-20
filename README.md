# AgriScan AI

**Diagnostic IA des maladies des plantes**

AgriScan AI est une application mobile et web de diagnostic agricole assisté par intelligence artificielle. Elle permet aux agriculteurs, agronomes et techniciens de terrain d'identifier rapidement les maladies des cultures, d'obtenir des recommandations de traitement, et de suivre l'évolution sanitaire de leurs parcelles.

---

## Fonctionnalités

- **🔍 Diagnostic intelligent** — Photographiez une plante malade et l'IA analyse les symptômes pour identifier la maladie, estimer sa probabilité, et proposer un traitement
- **💬 Assistant conversationnel** — Dialoguez avec un agent IA spécialisé en pathologie végétale pour affiner le diagnostic et poser des questions complémentaires
- **📊 Tableau de bord** — Visualisez vos statistiques (diagnostics par statut, tendances) et gérez l'ensemble de vos diagnostics
- **🚨 Alertes phytosanitaires** — Recevez des alertes géolocalisées (maladies, météo, recommandations) visualisables sur carte interactive
- **👤 Profil utilisateur** — Gérez vos informations, votre exploitation agricole, et vos paramètres de compte

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 19, React Native 0.81, Expo SDK 54, Expo Router 6, TypeScript 5.9 |
| **État** | Zustand 5 |
| **Backend** | Python FastAPI, Uvicorn, Motor (async MongoDB) |
| **Base de données** | MongoDB |
| **IA** | GPT-5.2 via Emergent Integrations |
| **Cartographie** | react-native-maps (natif), Google Maps JS API (web) |
| **Stockage** | AsyncStorage + SecureStore (natif), AsyncStorage (web) |

---

## Architecture

### Frontend

Architecture fondée sur **Expo Router** avec routage fichier :

```
frontend/
  app/
    _layout.tsx              # Layout racine (auth, tabs, modals)
    index.tsx                # Écran de démarrage
    (auth)/                  # Connexion et inscription
    (tabs)/                  # Navigation par onglets
      home.tsx               # Accueil (stats, diagnostics récents)
      diagnostic.tsx         # Chat diagnostic avec l'IA
      dashboard.tsx          # Tableau de bord et historique
      alerts.tsx             # Alertes et carte
      profile.tsx            # Profil utilisateur
    edit-profile.tsx         # Modification du profil (modal)
    change-password.tsx      # Changement de mot de passe (modal)
  src/
    store/authStore.ts       # Store Zustand (auth, profil)
    types/index.ts           # Types TypeScript
    components/              # Composants réutilisables
    constants/theme.ts       # Thème SYNAPSE (design system)
```

### Backend

API REST Python **FastAPI** organisée sous le préfixe `/api` :

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/signup` | Création de compte |
| `POST /api/auth/login` | Connexion |
| `GET/PATCH /api/users/{uid}` | Profil utilisateur |
| `POST /api/diagnostics` | Création d'un diagnostic |
| `GET /api/diagnostics/{user_id}` | Liste des diagnostics |
| `GET /api/diagnostics/{id}/detail` | Détail d'un diagnostic |
| `PATCH /api/diagnostics/{id}/status` | Changement de statut |
| `DELETE /api/diagnostics/{id}` | Suppression |
| `POST /api/chat` | Envoi d'un message à l'IA |
| `GET /api/messages/{diagnostic_id}` | Historique de conversation |
| `POST/GET /api/alerts/{user_id}` | Alertes |
| `PATCH /api/alerts/{id}/read` | Marquer comme lu |
| `GET /api/stats/{user_id}` | Statistiques |

### Base de données

- **`users`** — Comptes utilisateurs
- **`diagnostics`** — Diagnostics avec culture, symptômes, diagnostic, probabilité, traitement, statut
- **`alerts`** — Alertes géolocalisées (type, sévérité, position)
- **`messages_{id}`** — Une collection par diagnostic pour l'historique des conversations

---

## Modèle IA

Le système utilise **GPT-5.2** via la bibliothèque `emergentintegrations` avec un *system prompt* spécialisé en pathologie végétale. L'IA :

1. Analyse les symptômes décrits et les photos fournies
2. Identifie la maladie avec un pourcentage de probabilité
3. Propose un traitement adapté
4. Émet des recommandations de prévention
5. Évalue le niveau d'urgence

Les réponses contenant un diagnostic structuré mettent automatiquement à jour le dossier avec le nom de la maladie, la probabilité et le traitement.

---

## Développement

### Prérequis

- Node.js 18+
- Python 3.11+
- MongoDB (instance locale ou distante)

### Installation

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # Configurer MONGO_URL, DB_NAME, EMERGENT_LLM_KEY
uvicorn server:app --reload --port 8000

# Frontend
cd frontend
npm install
cp .env.example .env   # Configurer EXPO_PUBLIC_BACKEND_URL
npx expo start
```

### Tests

```bash
python backend_test.py     # Tests API backend
pytest                     # Suite pytest
```

---

## Déploiement

- **Backend de production :** `https://crop-health-scan-21.preview.emergentagent.com`
- **Variables d'environnement requises :**
  - `MONGO_URL` — URI de connexion MongoDB
  - `DB_NAME` — Nom de la base de données
  - `EMERGENT_LLM_KEY` — Clé API Emergent Integrations
  - `EXPO_PUBLIC_BACKEND_URL` — URL du backend pour le frontend
  - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` — Clé API Google Maps

---

## Thème / Design System

L'interface utilise le thème **SYNAPSE** — un design system sombre et cinématographique aux accents naturels :

- **Palette :** verts forestiers, crème, citron vert, tons anthracite
- **Ambiance :** sombre, premium, adaptée au terrain
- **Composants :** Markdown vert sur fond sombre pour les réponses IA, cartes statiques, badges de statut colorés

---

## Licence

Projet d'étude — à usage éducatif et de démonstration.
