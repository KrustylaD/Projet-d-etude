# AgriDoc — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une app mobile no-code (Bubble) de diagnostic de maladies des plantes via chatbot IA conversationnel.

**Architecture:** Bubble (frontend + backend + BDD) → API Connector → API LLM externe pour le chatbot. Firebase Auth pour l'authentification. Plugin Bubble Map pour la carte interactive.

**Tech Stack:** Bubble.io (no-code), Firebase, API Anthropic/OpenAI, Plugin Bubble Map (Leaflet)

---

## Prérequis

- Compte Bubble (gratuit) sur [bubble.io](https://bubble.io)
- Compte Firebase (gratuit) sur [console.firebase.google.com](https://console.firebase.google.com)
- Clé API pour le LLM (Anthropic : [console.anthropic.com](https://console.anthropic.com) ou OpenAI : [platform.openai.com](https://platform.openai.com))

---

### Task 1: Création du projet Bubble et configuration Firebase

**Actions Bubble Editor :**

- [ ] **Step 1: Créer le projet Bubble**
  - Aller sur [bubble.io](https://bubble.io) → "Create an app"
  - Nom : `agridoc`
  - Template : "Blank" (départ de zéro)

- [ ] **Step 2: Configurer Firebase dans Bubble**
  - Onglet "Plugins" → "Add plugins" → chercher "Firebase"
  - Installer le plugin Firebase (par Bubble)
  - Dans la console Firebase, créer un projet nommé `agridoc`
  - Activer Firestore Database en mode test
  - Activer Authentication → Email/Password
  - Copier la config Firebase (Project Settings → General → Web app → Config)
  - Coller la config dans le plugin Firebase de Bubble (apiKey, authDomain, projectId, etc.)

- [ ] **Step 3: Vérifier la connexion Firebase**
  - Créer une page test temporaire
  - Ajouter un bouton "Test Firebase" avec un workflow qui crée un document dans Firestore
  - Preview → cliquer → vérifier que le document apparaît dans Firestore
  - Supprimer la page test

---

### Task 2: Structure de la base de données (Firestore)

**Collections à créer :**

- [ ] **Step 1: Collection `users`**
  - `email` (text)
  - `name` (text)
  - `farm_name` (text, optionnel)
  - `location` (geographic address)
  - `role` (text: "farmer" | "admin")
  - `created_at` (date)

- [ ] **Step 2: Collection `diagnostics`**
  - `user_id` (text — référence user)
  - `culture` (text: ex "tomates", "blé")
  - `symptoms` (text — description brute)
  - `conversation` (list of texts — échange complet)
  - `diagnosis` (text — maladie identifiée)
  - `probability` (number — pourcentage)
  - `treatment` (text — recommandation)
  - `location` (geographic address)
  - `status` (text: "en cours" | "traité" | "surveillance")
  - `created_at` (date)

- [ ] **Step 3: Collection `sensor_data`**
  - `user_id` (text)
  - `temperature` (number)
  - `humidity` (number)
  - `rainfall` (number)
  - `timestamp` (date)

- [ ] **Step 4: Collection `alerts`**
  - `user_id` (text)
  - `type` (text: "maladie" | "météo")
  - `message` (text)
  - `severity` (text: "info" | "warning" | "critical")
  - `read` (boolean)
  - `created_at` (date)

---

### Task 3: Authentification (Connexion / Inscription)

**Pages à créer :** `login`, `signup`

- [ ] **Step 1: Créer la page `signup`**
  - Ajouter un groupe "Signup Form"
  - Inputs : `Name` (text), `Email` (text), `Password` (password), `Farm` (text), `Location` (address)
  - Bouton "Créer mon compte"
  - Workflow : Firebase → Create User (email, password) → Créer document `users` avec les infos → Rediriger vers `home`

- [ ] **Step 2: Créer la page `login`**
  - Inputs : `Email`, `Password`
  - Bouton "Se connecter"
  - Workflow : Firebase → Sign In (email, password) → Rediriger vers `home`
  - Lien "Pas encore de compte ?" → `signup`
  - Lien "Mot de passe oublié ?" → workflow Firebase reset password

- [ ] **Step 3: Gérer les erreurs d'auth**
  - Dans chaque workflow, ajouter une étape conditionnelle : si erreur, afficher un message dans un groupe "Error Message" (texte rouge)
  - Messages : "Email déjà utilisé", "Mot de passe incorrect", "Email invalide"

- [ ] **Step 4: Barre de navigation conditionnelle**
  - Si user connecté → afficher "Mon compte" et "Déconnexion"
  - Si non connecté → afficher "Connexion"
  - Workflow Déconnexion : Firebase → Sign Out → Rediriger vers `home`

---

### Task 4: Page d'accueil

**Page :** `home`

- [ ] **Step 1: Structure de la page**
  - Header : Logo "🌱 AgriDoc" + menu nav (Diagnostic | Carte | Communauté | Connexion/Compte)
  - Zone contenu scrollable
  - Footer : Mentions légales | CGU | Contact | Réseaux sociaux

- [ ] **Step 2: Section alertes**
  - Groupe "Alert Box" avec fond vert clair, bordure gauche verte
  - RepeatingGroup lié à la collection `alerts` (filtré par user)
  - Affiche les alertes non lues : icône + message + date

- [ ] **Step 3: Grille d'accès rapide (2x2)**
  - 4 boutons en grille CSS Grid :
    - "🔍 Diagnostic IA" (vert) → workflow navigate to `diagnostic`
    - "🗺️ Carte" (bleu) → workflow navigate to `map`
    - "👥 Communauté" (violet) → workflow navigate to `community`
    - "📊 Tableau de bord" (orange) → workflow navigate to `dashboard`

- [ ] **Step 4: Section actualités**
  - Groupe "News" avec 2-3 cartes statiques :
    - Météo 7 jours (données simulées)
    - Conseil de saison (texte fixe)
    - Astuce du mois (texte fixe)

- [ ] **Step 5: Responsive**
  - Vérifier en preview mobile (icône téléphone dans Bubble)
  - Ajuster les largeurs en pourcentage (pas de pixels fixes)
  - La grille 2x2 doit rester lisible sur mobile

---

### Task 5: Module Diagnostic IA (chatbot)

**Page :** `diagnostic`

- [ ] **Step 1: Interface du chat**
  - RepeatingGroup vertical avec scroll automatique
  - Chaque cellule = une bulle de message (conditionnelle) :
    - Si `role = "user"` → bulle alignée à droite, fond vert clair
    - Si `role = "assistant"` → bulle alignée à gauche, fond bleu clair
    - Si `role = "diagnosis"` → bulle avec fond orange clair, bordure orange
  - Chaque bulle affiche `content` (text)

- [ ] **Step 2: Zone de saisie**
  - Input multiligne "Décrivez les symptômes..."
  - Bouton "Envoyer" (👈 ou icône flèche)

- [ ] **Step 3: Configuration de l'API Connector**

  Dans l'onglet "Plugins" → "API Connector" → "Add another API" :

  ```
  Nom de l'API : Anthropic (ou OpenAI)
  Authentication : Private key in header
  Header Key : x-api-key (Anthropic) ou Authorization: Bearer (OpenAI)
  ```

  Ajouter un appel API :

  ```
  Name : chat_diagnostic
  Use as : Action
  Method : POST
  URL : https://api.anthropic.com/v1/messages
  Headers :
    x-api-key: [VOTRE_CLÉ]
    anthropic-version: 2023-06-01
    content-type: application/json
  Body type : JSON
  Body :
  {
    "model": "claude-3-haiku-20240307",
    "max_tokens": 500,
    "system": "Tu es un assistant de diagnostic agricole. Tu aides les agriculteurs à identifier les maladies des plantes. Pose des questions de clarification, puis donne un diagnostic avec probabilité, traitement et prévention. Sois concis. IMPORTANT : quand tu as assez d'informations pour un diagnostic, commence ta réponse par 'DIAGNOSTIC:' suivi de la maladie, probabilité, traitement.",
    "messages": [{"role": "user", "content": "<user_message>"}]
  }
  ```

  > Si OpenAI : URL = `https://api.openai.com/v1/chat/completions`, modèle = `gpt-3.5-turbo`, adapter le body.

- [ ] **Step 4: Prompt system pour l'IA**
  ```
  Tu es AgriDoc, un assistant de diagnostic des maladies des plantes.
  Ton rôle : aider les agriculteurs à identifier les maladies de leurs cultures.

  Règles :
  1. Pose UNE question à la fois pour affiner le diagnostic
  2. Demande : la culture concernée, les symptômes visibles, la localisation
     des symptômes, depuis quand, conditions météo récentes
  3. Après 3-4 échanges, donne un diagnostic au format :
     DIAGNOSTIC:
     Maladie: [nom]
     Probabilité: [pourcentage]%
     Traitement: [recommandation]
     Prévention: [conseils]
  4. Si tu n'es pas sûr, indique les 2 maladies les plus probables
  5. Reste concis (pas plus de 3-4 phrases par réponse)
  ```

- [ ] **Step 5: Workflow d'envoi de message**

  Quand l'utilisateur clique "Envoyer" :
  1. Créer un document temporaire `current_chat` avec `role = "user"` et `content = input`
  2. Ajouter au RepeatingGroup (la bulle apparaît)
  3. Appeler l'API `chat_diagnostic` avec le contenu
  4. Récupérer la réponse de l'API
  5. Créer un document avec `role = "assistant"` et `content = réponse`
  6. Ajouter au RepeatingGroup
  7. Vider l'input
  8. Scroller en bas du chat

- [ ] **Step 6: Détection et sauvegarde du diagnostic**
  - Après chaque réponse de l'assistant, vérifier si le texte contient "DIAGNOSTIC:"
  - Si oui : extraire maladie, probabilité, traitement
  - Créer un document dans `diagnostics` avec toutes les infos
  - Ajouter une alerte dans `alerts` pour le tableau de bord
  - Afficher un bouton "Voir le traitement détaillé"

- [ ] **Step 7: Gestion de l'historique de conversation**
  - Stocker tous les messages d'une session dans un champ `conversation` (list)
  - Bouton "Nouveau diagnostic" → vider le chat et réinitialiser
  - Le RepeatingGroup est lié aux messages de la session courante

---

### Task 6: Carte interactive

**Page :** `map`

- [ ] **Step 1: Installer le plugin Map**
  - Plugins → Add plugins → chercher "Map" (par Bubble) ou "Leaflet"
  - Installer et configurer (clé API Mapbox gratuite optionnelle, sinon OpenStreetMap)

- [ ] **Step 2: Ajouter la carte**
  - Glisser l'élément "Map" sur la page
  - Régler hauteur : 100% de la hauteur d'écran moins le header
  - Centrer sur la France (lat: 46.603354, lng: 1.888334, zoom: 6)

- [ ] **Step 3: Ajouter les marqueurs**
  - Source de données : rechercher les `diagnostics` (tous les utilisateurs, pour vue communautaire)
  - Chaque diagnostic → un marqueur sur la carte
  - Couleur du marqueur selon le statut :
    - `probability > 70%` → rouge (alerte)
    - `probability 30-70%` → jaune (surveiller)
    - `probability < 30%` → vert (sain)
  - Au clic sur un marqueur → popup avec : culture, maladie, probabilité, date

- [ ] **Step 4: Filtres**
  - Ajouter des boutons de filtre en haut de la carte :
    - "Tout" | "Alertes" | "Tomates" | "Blé" | "Vigne"
  - Chaque bouton applique un filtre sur la source de données des marqueurs

- [ ] **Step 5: Légende**
  - En bas de la carte, afficher :
    - 🔴 Alerte (>70%) | 🟡 Surveiller (30-70%) | 🟢 Sain (<30%)

---

### Task 7: Tableau de bord utilisateur

**Page :** `dashboard`

- [ ] **Step 1: Indicateurs météo (4 cartes en grille 2x2)**
  - Récupérer les dernières données de `sensor_data` pour le user
  - Carte 1 : 🌡️ Température → `sensor_data.temperature` °C
  - Carte 2 : 💧 Humidité → `sensor_data.humidity` %
  - Carte 3 : 🌧️ Pluie (7j) → somme `sensor_data.rainfall` sur 7 jours
  - Carte 4 : ⚠️ Alertes → count de `alerts` non lues

- [ ] **Step 2: Historique des diagnostics**
  - RepeatingGroup lié à `diagnostics` filtré par user, trié par date desc
  - Chaque ligne affiche : maladie, culture, probabilité (barre de progression colorée), date, statut
  - Bouton "Voir le diagnostic" → popup avec conversation complète + traitement

- [ ] **Step 3: Alertes IA personnalisées**
  - RepeatingGroup lié à `alerts` filtré par user, non lues
  - Chaque alerte : icône + message + bouton "Marquer comme lu"
  - Workflow "Marquer comme lu" → update `alerts.read = true`

- [ ] **Step 4: Données simulées (fallback)**
  - Si aucun `sensor_data` n'existe, afficher des valeurs par défaut :
    - Température : 22°C, Humidité : 65%, Pluie : 12mm
  - Ajouter un bouton "Ajouter des données" → page ou popup de saisie

---

### Task 8: Espace communautaire (optionnel)

**Page :** `community`

- [ ] **Step 1: Forum simplifié**
  - Collection `posts` : `user_id`, `user_name`, `title`, `content`, `category`, `created_at`
  - Collection `comments` : `post_id`, `user_id`, `user_name`, `content`, `created_at`

- [ ] **Step 2: Interface**
  - RepeatingGroup des posts (triés par date desc)
  - Chaque post : titre, auteur, catégorie, date, nombre de commentaires
  - Bouton "Nouveau post" → popup avec formulaire (titre, catégorie, contenu)
  - Au clic sur un post → page `post_detail` avec les commentaires

- [ ] **Step 3: Catégories**
  - Cultures (Tomates, Blé, Vigne, Maraîchage, Autres)
  - Bonnes pratiques
  - Questions générales

---

### Task 9: Pages compte utilisateur

**Pages :** `account`, `edit_account`

- [ ] **Step 1: Page `account`**
  - Afficher les infos du user courant : nom, email, exploitation, localisation
  - Bouton "Modifier mon profil" → workflow navigate to `edit_account`
  - Bouton "Déconnexion" → Firebase Sign Out
  - Section "Mes cultures suivies" → liste éditables

- [ ] **Step 2: Page `edit_account`**
  - Formulaire pré-rempli avec les données du user
  - Inputs : Name, Farm Name, Location
  - Bouton "Enregistrer" → update document `users` → rediriger vers `account`

---

### Task 10: Administration (back-office)

**Page :** `admin`

- [ ] **Step 1: Restreindre l'accès**
  - Dans le workflow de la page `admin`, vérifier si `current user.role = "admin"`
  - Si non → rediriger vers `home` avec message "Accès non autorisé"

- [ ] **Step 2: Dashboard stats**
  - Nombre total d'utilisateurs : count de `users`
  - Nombre de diagnostics ce mois : count de `diagnostics` filtrés par mois courant
  - Maladie la plus fréquente : agrégation sur `diagnostics.diagnosis`
  - Région la plus active : agrégation sur `diagnostics.location`

- [ ] **Step 3: Gestion des utilisateurs**
  - RepeatingGroup lié à `users`
  - Colonnes : Nom, Email, Exploitation, Date inscription, Nombre de diagnostics, Rôle
  - Actions par utilisateur : bouton "Désactiver" (update `users.active = false`), "Passer admin"

- [ ] **Step 4: Gestion des données**
  - Liste des diagnostics récents (tous utilisateurs)
  - Possibilité de supprimer un diagnostic (bouton corbeille)
  - Export CSV (optionnel) → workflow avec Bubble CSV export

---

### Task 11: Intégration des données capteurs simulées

- [ ] **Step 1: Créer un script de génération de données**
  - Dans Bubble, créer une page cachée `data_generator` accessible uniquement en preview
  - Ajouter un workflow récurrent (Schedule API Workflow sur le plan payant) OU
  - Ajouter un bouton manuel "Générer données" pour la démo
  - Le workflow crée un document dans `sensor_data` avec :
    ```
    user_id = current user
    temperature = random entre 15 et 35
    humidity = random entre 40 et 90
    rainfall = random entre 0 et 25
    timestamp = current date/time
    ```

- [ ] **Step 2: Option alternative — script Python externe**
  ```python
  import random, time, firebase_admin
  from firebase_admin import credentials, firestore

  cred = credentials.Certificate("serviceAccountKey.json")
  firebase_admin.initialize_app(cred)
  db = firestore.client()

  while True:
      db.collection("sensor_data").add({
          "user_id": "demo_user",
          "temperature": round(random.uniform(15, 35), 1),
          "humidity": round(random.uniform(40, 90), 1),
          "rainfall": round(random.uniform(0, 25), 1),
          "timestamp": firestore.SERVER_TIMESTAMP
      })
      time.sleep(3600)  # Toutes les heures
  ```

- [ ] **Step 3: Démo sans backend**
  - Insérer manuellement 5-10 documents dans `sensor_data` via la console Firebase
  - Ces données seront affichées dans le tableau de bord

---

### Task 12: Tests, responsive et déploiement

- [ ] **Step 1: Tests fonctionnels**
  - Créer un compte test (email: test@agridoc.fr / mdp: test123)
  - Tester le flow complet : inscription → connexion → diagnostic → carte → dashboard → déconnexion
  - Vérifier que les données s'enregistrent dans Firestore
  - Vérifier le chatbot : envoyer un message, recevoir une réponse, obtenir un diagnostic

- [ ] **Step 2: Tests responsive**
  - Preview mobile dans Bubble
  - Tester sur smartphone réel (ouvrir le lien Bubble dans Chrome mobile)
  - Vérifier : pas de scroll horizontal, texte lisible, boutons cliquables
  - Ajuster les tailles de police pour mobile (minimum 16px pour les inputs)

- [ ] **Step 3: Déploiement**
  - Bubble → Settings → Domain/Email → copier le lien public (sous-domaine bubbleapps.io)
  - Optionnel : connecter un domaine personnalisé
  - Partager le lien pour la soutenance

- [ ] **Step 4: Préparation soutenance**
  - Créer 3 comptes utilisateurs avec diagnostics types
  - Avoir un scénario de démo prêt :
    1. Connexion
    2. Diagnostic : "Mes plants de tomates ont des taches brunes sur les feuilles"
    3. Interaction avec le chatbot
    4. Affichage du diagnostic
    5. Navigation vers la carte
    6. Consultation du tableau de bord

---

### Task 13: Rapport et documentation

- [ ] **Step 1: Structure du rapport (Word/PowerPoint)**
  - Introduction : problématique IA & Agriculture
  - Présentation du projet AgriDoc
  - Veille technologique (outils no-code, modèles IA, APIs)
  - Architecture technique (schéma)
  - Fonctionnalités détaillées (captures d'écran)
  - Difficultés rencontrées et solutions
  - Conclusion et perspectives

- [ ] **Step 2: Captures d'écran**
  - Prendre des screenshots de chaque page
  - Annoter les fonctionnalités clés

- [ ] **Step 3: Préparation soutenance orale**
  - Démo live de l'application (5 min)
  - Présentation PowerPoint (10 slides max)
  - Questions/réponses
