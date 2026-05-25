# Script de Présentation — AgriScan AI

**3 personnes · 18 slides · ~15-18 min**

---

## Distribution

| Personne | Slides | Contenu |
|----------|--------|---------|
| **Personne 1** | 0–5 | Cover, Problème, Solution, Fonctionnalités, Focus Diagnostic, Alertes |
| **Personne 2** | 6–11 | No/Low-Code, Architecture, Stack, Défis, Migration, DeepSeek |
| **Personne 3** | 12–17 | Impact, Auth, Carte, IoT, Admin, Conclusion |

---

## PERSONNE 1 — Slides 0 à 5

### Slide 0 — Cover

**Texte :**
> Bonjour à tous. Je suis ravi de vous présenter aujourd'hui notre projet d'étude : **AgriScan AI**.
>
> AgriScan AI est une application mobile et web de **diagnostic intelligent des maladies des plantes**, développée dans le cadre de notre Bachelor 2025-2026, en réponse à une demande de la **Chambre d'Agriculture**.
>
> L'idée est simple : permettre à un agriculteur de **photographier une plante suspecte** et d'obtenir instantanément un diagnostic — maladie, probabilité, urgence et traitement recommandé — le tout propulsé par l'intelligence artificielle.

---

### Slide 1 — Problème

**Texte :**
> Avant de vous parler de la solution, posons le problème.
>
> Aujourd'hui, quand un agriculteur voit une plante malade dans son champ, il ne peut pas toujours joindre un agronome rapidement. Le délai moyen d'un diagnostic est de **48 à 72 heures** — un délai critique pendant lequel la maladie peut se propager.
>
> **Conséquence** : un traitement tardif peut entraîner jusqu'à **40% de perte de récolte**, ce qui est irréversible pour la saison.
>
> Et pour couronner le tout, les alertes phytosanitaires sont dispersées entre différentes sources, sans **aucune visualisation géolocalisée** centralisée. L'agriculteur n'a pas une vue d'ensemble des menaces qui pèsent sur ses parcelles.

---

### Slide 2 — Solution

**Texte :**
> C'est là qu'AgriScan AI intervient.
>
> **Une photo. Une analyse. Un traitement.**
>
> Notre application permet à l'utilisateur de :
> 1. **Photographier** la plante suspecte directement depuis son mobile
> 2. **Analyser** l'image via notre agent IA spécialisé en pathologie végétale
> 3. **Traiter** grâce à une recommandation personnalisée
>
> Le tout en **moins de 5 secondes**, sans avoir besoin d'un expert sur le terrain.
>
> L'application est déjà accessible en ligne à cette adresse.

---

### Slide 3 — Fonctionnalités

**Texte :**
> Concrètement, AgriScan AI s'articule autour de **5 fonctionnalités clés** :
>
> - **Le Diagnostic IA** : le cœur de l'application — on prend une photo, l'IA identifie la maladie avec sa probabilité et propose un traitement
> - **L'Assistant conversationnel** : un agent IA spécialisé avec lequel on peut discuter, dossier par dossier
> - **Le Dashboard & Historique** : pour suivre ses diagnostics, ses statistiques et gérer son exploitation
> - **Les Alertes géolocalisées** : une carte interactive avec les risques phytosanitaires
> - **Le Profil & Exploitation** : gestion du compte et des paramètres personnels
>
> Voici un aperçu de l'interface avec la page d'accueil, la connexion et le profil utilisateur.

---

### Slide 4 — Focus Diagnostic IA

**Texte :**
> Plongeons un peu plus dans la **feature principale** : le diagnostic par IA.
>
> Contrairement à un simple chatbot, nous avons conçu un **véritable agent expert**. L'utilisateur envoie une photo, et le moteur GPT-5.2 — avec un system prompt spécialisé en pathologie végétale — analyse l'image et retourne un résultat structuré.
>
> On obtient : **le nom de la maladie, un pourcentage de probabilité, un niveau d'urgence, et le traitement recommandé**.
>
> Et si le résultat n'est pas assez précis, on peut dialoguer avec l'agent pour affiner le diagnostic.
>
> Voici un exemple concret : "Mildiou de la vigne — 87% — Urgence modérée".

---

### Slide 5 — Focus Alertes & Carte

**Texte :**
> Pour finir ma partie, parlons des **alertes phytosanitaires**.
>
> L'application intègre une **carte Google Maps interactive** qui permet à l'agriculteur de visualiser ses parcelles et les alertes en cours.
>
> Chaque alerte est **classée par type et par sévérité** : critique, modérée, ou simple information. On peut voir d'un coup d'œil ce qui menace ses cultures avant même d'aller au champ.
>
> L'application intègre aussi les **données météo** et envoie des **notifications personnalisées** par zone.
>
> C'est un outil de **vigilance temps réel** qui transforme la manière dont l'agriculteur surveille son exploitation.

---

## PERSONNE 2 — Slides 6 à 11

### Slide 6 — Approche No/Low-Code

**Texte :**
> Merci. Je vais maintenant vous expliquer notre **approche de développement**.
>
> Nous avons adopté une stratégie hybride : **No/Low-Code + agents IA**.
>
> D'un côté, nous avons utilisé la **plateforme Emergent** — une solution no-code qui nous a permis d'accélérer le développement : infrastructure, base de données, authentification, stockage — tout était natif. Le **time-to-market a été divisé par 3**.
>
> De l'autre côté, nous avons **superposé des agents IA spécialisés** : un system prompt pour la pathologie végétale, une mémoire de conversation par dossier diagnostic, et une analyse multimodale photo + texte.
>
> Et troisièmement, face aux restrictions de la plateforme Emergent, nous avons dû opérer une **migration locale** dont je reparlerai. Le code a été exporté, adapté pour fonctionner en local avec FastAPI, Motor, MongoDB et DeepSeek.
>
> Ce n'est pas du no-code basique — c'est une **architecture hybride moderne**.

---

### Slide 7 — Architecture

**Texte :**
> Regardons maintenant l'**architecture technique** dans son ensemble.
>
> En haut, le **client** : une application React Native avec Expo SDK, compatible mobile et web, avec Google Maps intégré.
>
> Au milieu, le **serveur** : une API REST FastAPI en Python avec MongoDB pour la persistance des données, et une authentification par JWT.
>
> Ensuite, la couche **intelligence** : GPT-5.2 via l'API Emergent Integrations, avec notre system prompt de pathologie végétale.
>
> Et enfin, la nouveauté : un **backend local** qui reprend toute la logique — FastAPI, Motor, MongoDB, avec DeepSeek intégré — pour une exécution **100% locale, zéro dépendance cloud**.
>
> C'est cette architecture qui nous a permis de migrer proprement sans interruption de service.

---

### Slide 8 — Stack Frontend

**Texte :**
> Au niveau du frontend, voici les **technologies que nous avons maîtrisées** tout au long du projet — technologies choisies par la plateforme Emergent pour le développement :
>
> - **React 19** avec les hooks modernes
> - **React Native 0.81** avec Expo SDK 54 pour le cross-platform natif
> - **TypeScript 5.9** avec typage strict
> - **Expo Router 6** pour la navigation par fichiers
> - **Zustand 5** pour la gestion d'état global
> - **Google Maps API** pour la cartographie
>
> Ce sont **6 technologies** que nous avons déployées en production, de la conception au déploiement.

---

### Slide 9 — Défis Surmontés

**Texte :**
> Bien sûr, ce projet n'a pas été un long fleuve tranquille. Voici les **3 défis majeurs** que nous avons dû surmonter.
>
> **Défi 1 — le cross-platform** : faire tourner le même code sur iOS, Android et Web. Notre solution ? Expo avec détection Platform.OS, AsyncStorage côté web, SecureStore côté natif, et deux implémentations Google Maps différentes. Résultat : un seul codebase, trois plateformes.
>
> **Défi 2 — l'intégration IA sans casser l'UX** : les appels à l'IA peuvent être lents. Notre solution ? Le **streaming des réponses** pour éviter les temps de chargement bloquants, et le parsing automatique des réponses structurées. Résultat : diagnostic en moins de 5 secondes.
>
> **Défi 3 — le plus critique** : les **crédits Emergent épuisés**. La plateforme no-code imposait des limites strictes de crédits, rendant la facturation intenable. Nous avons dû exporter tout le code et le faire fonctionner en local. Résultat : une **migration réussie vers DeepSeek local** dont je vais vous parler.

---

### Slide 10 — Migration Emergent → Local

**Texte :**
> Ce **pivot stratégique** a été un moment clé du projet.
>
> **Étape 1** : nous avons exporté l'intégralité du backend depuis la plateforme Emergent.
>
> **Étape 2** : nous avons adapté le code pour fonctionner en local avec **FastAPI, Motor et MongoDB** — plus aucune dépendance au cloud Emergent.
>
> **Étape 3** : nous avons gagné notre **autonomie totale** — contrôle complet sur l'infrastructure, coûts maîtrisés, et une roadmap libre.
>
> Ce qui aurait pu être un échec s'est transformé en opportunité : nous maîtrisons désormais **100% de notre stack technique**.

---

### Slide 11 — DeepSeek Continue

**Texte :**
> Pour terminer ma partie, parlons de la **nouvelle direction**.
>
> Nous utilisons désormais **DeepSeek-V4** pour la génération de code et l'assistance au développement — c'est notre copilote.
>
> Et pour les **diagnostics cultures**, nous utilisons **Llama 70B** — un modèle d'inférence performant spécialisé dans l'analyse de pathologie végétale.
>
> Les avantages sont multiples :
> - **Génération de code** rapide et de qualité
> - **Inférence diagnostique** précise
> - Et surtout : **100% local** — plus de crédits, plus de dépendance, plus de facturation imprévue

---

## PERSONNE 3 — Slides 12 à 17

### Slide 12 — Impact & Métriques

**Texte :**
> Merci. Alors, qu'est-ce que ce projet démontre concrètement ?
>
> - **2 plateformes** : mobile et web, livrées simultanément
> - **15+ endpoints API** : toute une API REST documentée
> - **1 agent IA expert** en pathologie végétale
> - **5 modules complets** : diagnostic, dashboard, alertes, profil, administration
> - **100% DeepSeek Ready** : la migration locale est effective
> - Et surtout : **70% de coûts en moins** grâce au passage de Emergent à DeepSeek
>
> Ce projet a été livré en **autonomie complète** — du design au déploiement, en passant par le mobile, le web, l'IA, le backend et le design system.

---

### Slide 13 — Authentification & Profil

**Texte :**
> Regardons maintenant quelques fonctionnalités en détail, en commençant par la **gestion de compte**.
>
> L'utilisateur peut s'inscrire et se connecter de manière sécurisée via email et mot de passe. Une fois connecté, il peut modifier son profil : photo, nom, email et mot de passe.
>
> Chaque utilisateur a un **rôle** — Admin ou Utilisateur — affiché avec un badge distinctif. Les routes privées sont protégées, et un **token JWT** est stocké localement pour une session persistante.
>
> C'est une gestion d'authentification complète, avec Zustand pour l'état et AsyncStorage pour la persistance.

---

### Slide 14 — Carte Interactive

**Texte :**
> Passons à la **cartographie**.
>
> AgriScan AI intègre une **carte Google Maps interactive** pour visualiser ses parcelles. Chaque parcelle est marquée par un code couleur selon le niveau d'alerte IA :
> - **Rouge** pour les alertes critiques
> - **Orange** pour la surveillance
> - **Vert** pour les zones saines
>
> On peut voir d'un coup d'œil les données par zone : température, humidité, risque. Un simple clic sur une parcelle affiche les détails.
>
> L'interface est adaptée aussi bien au mobile (via react-native-maps) qu'au web (via Google Maps JS).

---

### Slide 15 — Capteurs IoT

**Texte :**
> Parlons maintenant de l'**infrastructure IoT** — un aspect clé de l'agriculture de précision.
>
> Nous avons conçu et simulé des **capteurs** qui remontent en temps réel les données du terrain :
>
> - **Température** : 24,6 °C
> - **Humidité du sol** : 78%
> - **Lumière PAR** : 412 µmol/m²/s
> - **Vent** : 12 km/h
> - **pH du sol** : 6,8
> - **Batterie** : 73%
>
> Les données sont simulées côté frontend, mais l'architecture IoT — basée sur le protocole **LoRaWAN** — a été conçue pour fonctionner sur le terrain avec des capteurs réels. La connectivité affiche un signal de 4/5 avec une transmission toutes les 3 minutes.
>
> C'est une **architecture IoT complète**, prête à être déployée physiquement.

---

### Slide 16 — Administration

**Texte :**
> Côté **back-office**, l'administration est complète.
>
> Le tableau de bord affiche les indicateurs clés : **24 utilisateurs**, **89 diagnostics**, **12 alertes**, et **98% de disponibilité**.
>
> La gestion des utilisateurs permet de voir tous les comptes, leurs rôles, et de les administrer directement — comme vous pouvez le voir avec Jean, Marie, Pierre, Sophie et les 20 autres.
>
> Et le **modèle IA** — GPT-5.2 — est surveillé en temps réel : précision de 93%, 47 requêtes sur les dernières 24 heures, statut actif.
>
> C'est un outil de pilotage complet pour les administrateurs de la plateforme.

---

### Slide 17 — Conclusion / Remerciements

**Texte :**
> Pour conclure, AgriScan AI, c'est :
>
> **1. Du No/Low-Code** : nous avons utilisé Bolt.new et Lovable pour un prototypage rapide, sans dette technique.
>
> **2. De l'Intelligence Artificielle** : 3 agents IA spécialisés — diagnostic, génération de rapports, recommandations — le tout orchestré.
>
> **3. Une vision produit** : livré en 8 semaines, du design au déploiement, en autonomie complète — mobile ET web en production.
>
> Un grand merci à la **Chambre d'Agriculture** pour ce cahier des charges, à notre établissement pour l'encadrement, et à vous pour votre attention.
>
> **Des questions ?**
>
> La démo est accessible en ligne à l'adresse affichée — n'hésitez pas à la tester.

---

## Récapitulatif du temps

| Personne | Slides | Durée estimée |
|----------|--------|---------------|
| P1 | 0–5 (6 slides) | ~5–6 min |
| P2 | 6–11 (6 slides) | ~5–6 min |
| P3 | 12–17 (6 slides) | ~5–6 min |
| **Total** | **18 slides** | **~15–18 min** |

## Conseils de présentation

- **Transitions** : quand une personne finit, dire "Je passe la parole à..." pour fluidité
- **Slides 9-11** (Défis → Migration → DeepSeek) : à enchaîner sans pause — c'est l'histoire centrale du projet
- **Démo** : prévoir d'ouvrir l'URL sur un mobile ou un navigateur pendant les questions
- **Ton** : rester naturel, ne pas lire mot à mot — le script est une base, adaptez le langage à l'oral
