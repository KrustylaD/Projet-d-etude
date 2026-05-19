# AgriScan AI — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une app mobile avec FlutterFlow de diagnostic de maladies des plantes via chatbot IA conversationnel, avec Firebase comme backend.

**Architecture:** Firebase (BDD + Auth + Firestore) → FlutterFlow (frontend) → API LLM externe pour le chatbot (Anthropic/OpenAI)

**Tech Stack:** FlutterFlow (no-code frontend), Firebase Firestore (base de données), Firebase Authentication, API Anthropic/OpenAI

---

## Prérequis

- Compte Firebase (gratuit) sur [console.firebase.google.com](https://console.firebase.google.com)
- Compte FlutterFlow (gratuit) sur [flutterflow.io](https://flutterflow.io)
- Clé API pour le LLM (Anthropic : [console.anthropic.com](https://console.anthropic.com) ou OpenAI : [platform.openai.com](https://platform.openai.com))

---

## PHASE 1: Configuration Firebase (A à Z)

### Task 1: Création du projet Firebase et Firestore

- [ ] **Step 1: Créer le projet Firebase**
  - Aller sur [console.firebase.google.com](https://console.firebase.google.com)
  - Cliquer sur "Ajouter un projet"
  - Nom : `AgriScan AI`
  - Désactiver Google Analytics (optionnel)
  - Cliquer sur "Créer un projet"
  - Attendre que le projet soit prêt (~2-3 min)

- [ ] **Step 2: Activer Firestore Database**
  - Dans le menu de gauche → "Firestore Database"
  - Cliquer sur "Créer une base de données"
  - Mode de sécurité : "Mode test" (pour développement)
  - Localisation : sélectionner la région la plus proche (ex: `eur3` pour Europe)
  - Cliquer sur "Créer"

- [ ] **Step 3: Activer Firebase Authentication**
  - Menu de gauche → "Authentification"
  - Cliquer sur "Commencer"
  - Onglet "Méthode de connexion"
  - Activer "Email/Mot de passe"
  - Cliquer sur "Enregistrer"

---

### Task 2: Structure de la base de données Firestore

**Collections à créer :**

- [ ] **Step 1: Collection `users`**
  - Ouvrir Firestore Database
  - Cliquer sur "Démarrer une collection"
  - ID de collection : `users`
  - Premier document (auto-généré)
  - Ajouter les champs :
    - `email` — Type: `string`
    - `name` — Type: `string`
    - `farm_name` — Type: `string` (optionnel)
    - `location` — Type: `geopoint` (ou `string` si vous stockez une adresse textuelle)
    - `role` — Type: `string` (valeurs: "farmer" | "admin")
    - `created_at` — Type: `timestamp` (utiliser Server Timestamp depuis l'app)
  - Cliquer sur "Enregistrer"

- [ ] **Step 2: Collection `  `**
  - Cliquer sur "Ajouter une collection"
  - ID de collection : `diagnostics`
  - Ajouter les champs :
    - `user_ref` — Type: `reference` (référence au document `users/{uid}`)
    - `culture` — Type: `string` (ex: "tomates", "blé")
    - `symptoms` — Type: `string` (description libre)
    - `conversation` — Type: `array` of `map` ; chaque map contient:
        - `role` (string), `content` (string), `created_at` (timestamp)
    - `diagnosis` — Type: `string` (maladie identifiée)
    - `probability` — Type: `int64` (0-100) ou `double` (0.0-1.0) — choisissez un format et restez cohérent
    - `treatment` — Type: `string` (recommandation)
    - `location` — Type: `geopoint` (coordonnées) ou `string` (adresse)
    - `status` — Type: `string` ("en cours" | "traité" | "surveillance")
    - `created_at` — Type: `timestamp` (Server Timestamp recommandé)

- [ ] **Step 3: Collection `sensor_data`**
  - Cliquer sur "Ajouter une collection"
  - ID de collection : `sensor_data`
  - Ajouter les champs :
    - `user_ref` — Type: `reference` (référence au document `users/{uid}`)
    - `temperature` — Type: `double` (°C)
    - `humidity` — Type: `double` (%)
    - `rainfall` — Type: `double` (mm)
    - `timestamp` — Type: `timestamp` (Server Timestamp ou horodatage capteur)

- [ ] **Step 4: Collection `alerts`**
  - Cliquer sur "Ajouter une collection"
  - ID de collection : `alerts`
  - Ajouter les champs :
    - `user_ref` — Type: `reference` (référence au document `users/{uid}`)
    - `type` — Type: `string` ("maladie" | "météo")
    - `message` — Type: `string`
    - `severity` — Type: `string` ("info" | "warning" | "critical")
    - `read` — Type: `boolean`
    - `created_at` — Type: `timestamp`

---

### Task 3: Configurer les règles de sécurité Firestore

- [ ] **Step 1: Accéder aux règles Firestore**
  - Console Firebase → Firestore Database
  - Onglet "Règles"

- [ ] **Step 2: Remplacer les règles par defaut**
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Authentification requise pour toute lecture/écriture
      match /users/{uid} {
        allow read, write: if request.auth.uid == uid;
      }
      
      match /diagnostics/{document=**} {
        allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
        allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
        allow update, delete: if request.auth != null && resource.data.user_id == request.auth.uid;
      }
      
      match /alerts/{document=**} {
        allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && resource.data.user_id == request.auth.uid;
      }
      
      match /sensor_data/{document=**} {
        allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
        allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      }
    }
  }
  ```
  - Cliquer sur "Publier"

---

### Task 4: Obtenir les clés d'accès Firebase pour FlutterFlow

- [ ] **Step 1: Récupérer les identifiants du projet**
  - Console Firebase → Paramètres du projet (icône engrenage en haut)
  - Onglet "Général"
  - Copier et sauvegarder :
    - **Project ID** (ex: `AgriScan AI-abc123`)
    - **Project Number** (ex: `123456789`)
    - **API Key** (à créer si absente)

- [ ] **Step 2: Créer une clé API Web**
  - Console Firebase → Paramètres du projet
  - Onglet "Clés API"
  - Cliquer sur "Créer une clé API"
  - Copier la clé générée (ex: `AIza...`)

- [ ] **Step 3: Copier la config Firebase**
  - Console Firebase → Paramètres du projet → Onglet "Général"
  - Scroller vers le bas → "Vos applications"
  - Cliquer sur le bouton "</>" (Web)
  - Copier tout le bloc `firebaseConfig` (il contient apiKey, projectId, databaseURL, etc.)

---

## PHASE 2: Configuration de FlutterFlow

### Task 5: Création du projet FlutterFlow et connexion Firebase

- [ ] **Step 1: Créer un projet FlutterFlow**
  - Aller sur [flutterflow.io](https://flutterflow.io)
  - Se connecter ou créer un compte
  - Cliquer sur "Create New Project" ou "+ New Project"
  - Nom : `AgriScan AI`
  - Template : "Blank" ou "Starter"
  - Cliquer sur "Create"

- [ ] **Step 2: Connecter Firebase à FlutterFlow**
  - Ouvrir le projet FlutterFlow
  - Menu : Settings → "Firebase"
  - Cliquer sur "Connect Firebase"
  - Sélectionner le mode : "Automatic" (recommandé) ou "Manual"
  - Si Automatic : 
    - Cliquer sur "Sign in with Google"
    - Sélectionner le projet Firebase `AgriScan AI`
    - Autoriser FlutterFlow
  - Si Manual :
    - Coller les identifiants Firebase (projectId, apiKey, etc.)
  - Cliquer sur "Verify"

- [ ] **Step 3: Vérifier la connexion**
  - Dans FlutterFlow, aller à "Backend" → "Firestore"
  - Vérifier que les collections apparaissent : `users`, `diagnostics`, `alerts`, `sensor_data`

---

### Task 6: Configuration de l'authentification Firebase dans FlutterFlow

- [ ] **Step 1: Activer le contrôle d'authentification**
  - Menu : Settings → "Authentication"
  - Activer "Firebase Authentication"
  - Sélectionner "Email / Password"

- [ ] **Step 2: Créer la page de connexion**
  - Cliquer sur "Pages"
  - Ajouter une nouvelle page : "login"
  - Ajouter des composants :
    - TextInput pour Email
    - TextInput pour Mot de passe
    - Button "Se connecter"
  - Dans le workflow du bouton :
    - Action : Firebase → Sign in with Email
    - Récupérer email et password des inputs
    - Si succès : naviguer vers "home"
    - Si erreur : afficher message d'erreur

- [ ] **Step 3: Créer la page d'inscription**
  - Ajouter une nouvelle page : "signup"
  - Ajouter des composants :
    - TextInput pour Nom
    - TextInput pour Email
    - TextInput pour Mot de passe
    - TextInput pour Nom de la ferme
    - TextInput pour Localisation
    - Button "Créer mon compte"
  - Dans le workflow du bouton :
    - Action Firebase → Create User (email, password)
    - Créer un document dans la collection `users` avec les infos
    - Si succès : naviguer vers "home"
    - Si erreur : afficher message

- [ ] **Step 4: Gérer la déconnexion**
  - Dans la navigation principale, ajouter un menu utilisateur
  - Option "Déconnexion"
  - Workflow : Firebase → Sign Out → Rediriger vers login

---

### Task 7: Configuration de l'API LLM dans FlutterFlow

- [ ] **Step 1: Créer une fonction API pour le chatbot**
  - Menu : "Backend" → "API Calls"
  - Ajouter une nouvelle API : "chat_diagnostic"
  - Méthode : POST
  - URL : `https://api.anthropic.com/v1/messages` (Anthropic) ou `https://api.openai.com/v1/chat/completions` (OpenAI)

- [ ] **Step 2: Configurer les headers**
  - Ajouter Header : `x-api-key: [VOTRE_CLÉ_ANTHROPIC]` (ou `Authorization: Bearer [CLÉ_OPENAI]`)
  - Ajouter Header : `content-type: application/json`
  - Si Anthropic : Ajouter Header : `anthropic-version: 2023-06-01`

- [ ] **Step 3: Configurer le body de la requête**
  - Body type : JSON
  - Pour Anthropic :
  ```json
  {
    "model": "claude-3-haiku-20240307",
    "max_tokens": 500,
    "system": "Tu es un assistant de diagnostic agricole. Tu aides les agriculteurs à identifier les maladies des plantes. Pose des questions de clarification, puis donne un diagnostic avec probabilité, traitement et prévention. Sois concis. Quand tu as assez d'informations, commence ta réponse par 'DIAGNOSTIC:' suivi de la maladie, probabilité, traitement.",
    "messages": [{"role": "user", "content": "$user_message"}]
  }
  ```
  - Pour OpenAI :
  ```json
  {
    "model": "gpt-3.5-turbo",
    "max_tokens": 500,
    "system": "[même prompt qu'Anthropic]",
    "messages": [{"role": "user", "content": "$user_message"}]
  }
  ```

---

## PHASE 3: Construction des pages et workflows FlutterFlow

### Task 8: Page d'accueil (home)

- [ ] **Step 1: Créer la page home**
  - Ajouter une nouvelle page : "home"
  - Ajouter un AppBar avec :
    - Logo ou titre "🌱 AgriScan AI"
    - Menu utilisateur (avatar + bouton déconnexion)

- [ ] **Step 2: Ajouter une section alertes**
  - Ajouter un ListView connecté à la collection `alerts`
  - Filtrer par : `user_id == current_user.uid` et `read == false`
  - Afficher : icône + message + date + bouton "Marquer comme lu"

- [ ] **Step 3: Ajouter des boutons d'accès rapide**
  - Grille 2x2 avec 4 boutons :
    - "🔍 Diagnostic IA" → naviguer vers "diagnostic"
    - "🗺️ Carte" → naviguer vers "map"
    - "👥 Communauté" → naviguer vers "community"
    - "📊 Tableau de bord" → naviguer vers "dashboard"

- [ ] **Step 4: Ajouter une section actualités**
  - Afficher 2-3 cartes avec :
    - Météo 7 jours (données simulées ou API météo)
    - Conseil de saison (texte fixe)
    - Astuce du mois (texte fixe)

---

### Task 9: Page Diagnostic IA (chatbot)

- [ ] **Step 1: Créer la page diagnostic**
  - Ajouter une nouvelle page : "diagnostic"
  - Ajouter un ListView pour le chat (messages)
  - Chaque message a un conditional :
    - Si `role == "user"` : aligné à droite, fond vert
    - Si `role == "assistant"` : aligné à gauche, fond bleu
    - Si `role == "diagnosis"` : fond orange

- [ ] **Step 2: Ajouter la zone de saisie**
  - TextInput multiligne : "Décrivez les symptômes..."
  - Button "Envoyer" (avec icône flèche ou texte)

- [ ] **Step 3: Créer le workflow d'envoi**
  - Au clic sur "Envoyer" :
    1. Récupérer le texte de l'input
    2. Ajouter le message utilisateur à la liste locale (UI update)
    3. Effacer l'input
    4. Appeler l'API LLM (chat_diagnostic)
    5. Récupérer la réponse
    6. Ajouter la réponse à la liste
    7. Créer un document dans `diagnostics` avec :
       - `user_id`, `culture`, `symptoms`, `conversation` (array de messages), `created_at`
       - Si la réponse contient "DIAGNOSTIC:" : extraire et remplir `diagnosis`, `probability`, `treatment`

- [ ] **Step 4: Gérer les erreurs API**
  - Si erreur réseau : afficher "Impossible de se connecter"
  - Si limite d'API atteinte : afficher "Limite dépassée, réessayez plus tard"

---

### Task 10: Page Carte interactive

- [ ] **Step 1: Créer la page map**
  - Ajouter une nouvelle page : "map"
  - Ajouter un composant Google Map (intégration native FlutterFlow)

- [ ] **Step 2: Afficher les diagnostics sur la carte**
  - Récupérer tous les documents `diagnostics` de l'utilisateur
  - Pour chaque diagnostic, créer un marqueur avec :
    - Position : `location`
    - Info bulle : `culture`, `diagnosis`, `date`
    - Couleur selon `status` (rouge=urgent, orange=surveillance, vert=traité)

- [ ] **Step 3: Ajouter des contrôles**
  - Zoom +/-
  - Centrer sur la localisation actuelle (géolocalisation)
  - Filtrer les marqueurs par date ou statut

---

### Task 11: Tableau de bord (dashboard)

- [ ] **Step 1: Créer la page dashboard**
  - Ajouter une nouvelle page : "dashboard"

- [ ] **Step 2: Afficher des statistiques**
  - Nombre total de diagnostics
  - Maladies détectées (top 5)
  - Cultures principales
  - Taux de réussite des traitements

- [ ] **Step 3: Afficher l'historique**
  - ListView des 10 derniers diagnostics
  - Afficher : date, culture, maladie, statut
  - Cliquer sur un diagnostic pour voir les détails

---

### Task 12: Section Communauté

- [ ] **Step 1: Créer la page community**
  - Ajouter une nouvelle page : "community"

- [ ] **Step 2: Ajouter un forum simplifié**
  - ListView des posts (texte fixe ou données statiques pour la démo)
  - Chaque post : auteur, date, contenu, nombre de likes

- [ ] **Step 3: Permettre de partager des conseils**
  - TextInput pour écrire un nouveau post
  - Button "Partager"
  - Workflow : créer un document dans une collection `posts` (à créer)

---

## PHASE 4: Tests et Déploiement

### Task 13: Tests locaux

- [ ] **Step 1: Tester l'authentification**
  - Créer un compte de test
  - Se connecter
  - Vérifier que le document utilisateur est créé dans Firestore
  - Se déconnecter et reconnecter

- [ ] **Step 2: Tester le module diagnostic**
  - Envoyer un message au chatbot
  - Vérifier que la réponse de l'API LLM s'affiche
  - Vérifier que le diagnostic est sauvegardé dans Firestore

- [ ] **Step 3: Tester la navigation**
  - Vérifier que tous les liens fonctionnent
  - Tester sur mobile (mode responsive)

- [ ] **Step 4: Vérifier les données Firestore**
  - Console Firebase → Firestore Database
  - Vérifier les collections : `users`, `diagnostics`, `alerts`

---

### Task 14: Déploiement

- [ ] **Step 1: Générer la version Android/iOS**
  - Dans FlutterFlow : Menu "Deploy" → "Build"
  - Sélectionner Android / iOS
  - Cliquer sur "Build"
  - Attendre la compilation (~5-10 min)

- [ ] **Step 2: Télécharger l'APK (Android) ou IPA (iOS)**
  - Une fois la compilation terminée, télécharger le fichier
  - Tester sur un appareil mobile ou un émulateur

- [ ] **Step 3: Passer en mode production Firebase**
  - Console Firebase → Firestore Database
  - Onglet "Règles"
  - Changer le mode de "test" à "production"
  - Adapter les règles si nécessaire

---

## Architecture Finale

```
┌──────────────────────────────────────────┐
│         App Mobile (FlutterFlow)          │
│  (Authentification, Diagnostic, Carte)   │
└────────────────────┬─────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼─────────┐      ┌────────▼──────┐
   │   Firebase   │      │ API LLM        │
   │ ┌──────────┐ │      │ (Anthropic /   │
   │ │ Firestore│ │      │  OpenAI)       │
   │ │ (Data)   │ │      │                │
   │ ├──────────┤ │      └────────────────┘
   │ │ Auth     │ │
   │ │ (Users)  │ │
   │ └──────────┘ │
   └──────────────┘
```

---

## Points clés

✅ **Firebase** = toute la logique backend (authentification, stockage, sécurité)
✅ **FlutterFlow** = interface mobile + workflows
✅ **API LLM** = intelligence du chatbot de diagnostic
✅ **Règles Firestore** = sécurité des données (chaque user ne voit que ses données)
✅ **Collections Firestore** = structure claire et scalable


