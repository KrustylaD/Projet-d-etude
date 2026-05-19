# AgriScan Trailer v2 — Redesign Trailer Performat

> **Direction artistique :** SYNAPSE (dark tech cinématique)
> **Durée :** ~28s (840 frames @ 30fps, 1920×1080)
> **Palette :** Forest #0A1B0E, Cream #F9F9F2, Lime #D4FF50, Slate #2D3A2F, Black #050D07
> **Polices :** Plus Jakarta Sans (titles), Inter (body), JetBrains Mono (data)

---

## Architecture des nouveaux composants toolkit

### CameraShake
Wrapper qui applique un déplacement/rotation aléatoire paramétrable :
- `intensity` — amplitude du shake
- `decay` — vitesse d'atténuation
- `frequency` — intervalles entre shakes
- `rotation` — applique rotation ou translation uniquement

Utilisé sur les impacts de texte, les burst de données, le climax.

### KineticWord
Animation texte lettre par lettre :
- `variant: "explode" | "drop" | "zoom" | "cascade" | "spread"` — type d'entrée
- `letterDelay` — délai entre chaque lettre
- `stagger` — décalage par ligne
- Chaque lettre a sa propre position/rotation initiale aléatoire

Remplace tous les `opacity: fadeIn` des textes.

### TransitionOverlay
Effet plein écran entre les scènes :
- `type: "glitch" | "dataMorph" | "flash" | "wipe"`
- `duration` — frames de la transition
- `direction` — pour les wipes
- S'utilise comme séquence superposée entre deux scènes

### DataRain
Fond style Matrix :
- `density` — nombre de colonnes
- `speed` — vitesse de chute
- `color` — couleur des caractères
- Peut prendre toute la scène ou un viewport spécifique

### BeatPulse
Wrapper qui pulse le contenu enfant sur un rythme :
- `bpm` — battements par minute
- `amplitude` — force du pulse (scale)
- `glow` — intensité du halo lumineux
- Tous les enfants pulse ensemble : typo + background + glow

### SplitFrame
Multi-viewport :
- `panels` — nombre de splits (2, 3, 4)
- `layout` — grille personnalisable
- `gaps` — espacement + couleur de séparation
- Chaque panel contient un élément React indépendant

---

## Scène 1 — Logo (2.5s / 75f)

**Vue d'ensemble :** Flash d'ouverture, scan reveal agressif, signature de marque.

**Déroulé :**
- Frame 0-5 : Black
- Frame 5 : FLASH WHITE (1 frame) — marque l'impact d'ouverture
- Frame 6-30 : Scan line part de la gauche sur fond DataRain. Les lettres "AgriScan.ai" fusent depuis des positions aléatoires (haut, bas, coins) et s'assemblent au centre avec KineticWord variant "explode"
- Frame 25-45 : Subtitle "Diagnostic IA pour l'agriculture" apparait en KineticWord variant "drop" — chaque lettre tombe du haut
- Frame 45-65 : Le logo pulse doucement (BeatPulse), la scan line disparait
- Frame 65-75 : Transition glitch wipe (shear horizontal + RGB split)

**Camera :** Micro-shake frame 6-15 pendant l'assemblage des lettres
**Composants utilisés :** CameraShake, KineticWord, DataRain, BeatPulse, TransitionOverlay

---

## Scène 2 — Problem (3s / 90f)

**Vue d'ensemble :** Urgence, tension. Split screen de cultures malades. Texte percutant.

**Déroulé :**
- Frame 0-25 : SplitFrame 3 vignettes de plantes malades (SVG existant retravaillé) en cuts rapides toutes les 6-7f. DataRain rouge en fond avec CameraShake léger
- Frame 25-35 : "LES MALADIES" — KineticWord variant "drop" depuis le haut, lettres légèrement espacées à l'impact. CameraShake sur l'atterrissage
- Frame 35-50 : "DÉTRUISENT" — KineticWord variant "spread" depuis la droite, les lettres arrivent en glissant avec motion blur
- Frame 50-70 : "30% des récoltes perdues chaque année" — couleur rouge #ff3355, KineticWord depuis les coins
- Frame 70-90 : DataRain s'intensifie, tout le texte est visible → transition data morph

**Camera :** Shake sur chaque text reveal (decay rapide)
**Palette additionnelle :** Rouge #ff3355, Orange #ff8844
**Composants :** SplitFrame, DataRain, KineticWord, CameraShake, ParticleField, TransitionOverlay

---

## Scène 3 — Stats (3s / 90f)

**Vue d'ensemble :** Data impact. Chaque chiffre occupe tout l'écran, apparition brutale.

**Déroulé :**
- Frame 0-5 : Black
- Frame 5-30 : "1.3 MILLIARD" — KineticWord variant "drop" depuis le haut. Le nombre atterrit avec bounce (spring), le fond grid pulse avec BeatPulse. Sous-titre "de tonnes de nourriture gaspillées" slide en dessous
- Frame 30-55 : "200 M€" — KineticWord variant "spread" depuis la gauche, le nombre glisse et s'arrête net. Sous-titre slide derrière. Particules vertes explosent autour
- Frame 55-75 : "800 M" — KineticWord variant "zoom" depuis le centre, lettres grossissent depuis un point minuscule. Sous-titre apparaît en cascade
- Frame 75-90 : Les 3 chiffres visibles simultanément en BeatPulse synchro (pulse sur le même beat). Atmosphère saturée de data
- Frame 85-90 : Transition glitch wipe (RGB split intense)

**Beat :** Le BeatPulse accélère progressivement vers la fin de la scène
**Composants :** KineticWord, BeatPulse, DataRain, ParticleField, TransitionOverlay

---

## Scène 4 — Solution (3s / 90f)

**Vue d'ensemble :** Révélation technologique. Le réseau de neurones se déploie, la solution apparaît.

**Déroulé :**
- Frame 0-20 : NeuralNetwork émerge depuis un point central (scale 0→1) avec une pulsation lumineuse verte. Le réseau pulse comme un cœur qui s'éveille
- Frame 15-35 : "AgriScan.ai" — KineticWord variant "explode" : les lettres émergent depuis les nœuds du réseau de neurones
- Frame 30-50 : PhoneMockup slide depuis la droite avec rotation Z (0°→-5°→0°), s'arrête net avec un micro-bounce
- Frame 40-60 : "L'IA au service des agriculteurs" — KineticWord variant "cascade" lettre par lettre, comme du texte qui se tape
- Frame 60-75 : Pause — tout est visible, doux pulse lumineux. Transition glitch wipe horizontal

**Camera :** Léger zoom avant progressif (1.0→1.05)
**Composants :** NeuralNetwork (existant), KineticWord, PhoneMockup (existant + rotation), CameraShake, TransitionOverlay

---

## Scène 5 — Chatbot (3s / 90f)

**Vue d'ensemble :** Rapidité, conversation fluide. Le phone est au centre, le chat défile vite.

**Déroulé :**
- Frame 0-15 : PhoneMockup zoom avant (scale 0.3→1) depuis le lointain, atterrit au centre
- Frame 10-50 : Chat bubbles défient rapidement. Timing resserré : une bubble toutes les 8-10f (au lieu de 30f). Ordre : "Bonjour !" (10f) → "📸" (20f) → "Analyse..." (30f) → "Mildiou 97%" (40f) → "Traitement" (48f). Chaque bubble entre avec micro-spring
- Frame 15-75 : Data stream de code défile à droite en scroll rapide (DataRain + code snippets)
- Frame 50-65 : "Diagnostiquez en conversant" — KineticWord variant "cascade", lettres tombent en cascade depuis le haut du phone
- Frame 65-75 : BeatPulse sur tout l'écran → transition data morph

**Changement clé :** Les bubbles arrivent 3× plus vite, pas de temps mort entre elles
**Composants :** PhoneMockup (existant), ChatBubble (existant), DataRain, KineticWord, CameraShake (micro bob), TransitionOverlay

---

## Scène 6 — Map (3s / 90f)

**Vue d'ensemble :** Data géographique dynamique. La carte pivote et les pins tombent rapidement.

**Déroulé :**
- Frame 0-15 : MapDisplay apparaît avec zoom + léger rotation (comme un satellite qui s'aligne)
- Frame 10-45 : Pins DROP rapidement — un toutes les 6f (au lieu de 12f). Chaque pin pulse avec un ring qui s'expand. CameraShake léger à chaque drop
- Frame 20-45 : "VISUALISATION GÉOGRAPHIQUE" — KineticWord variant "drop" depuis le haut du cadre map
- Frame 45-65 : Labels clignotent en alerte (Mildiou, Rouille, Oïdium). Data stream géo (coordonnées) défile en overlay
- Frame 65-75 : Flash → glitch transition

**Nouveauté :** La carte est animée (rotation + zoom entry), pas un simple fade
**Composants :** MapDisplay (existant, animé), KineticWord, CameraShake, DataRain, TransitionOverlay

---

## Scène 7 — Dashboard (3s / 90f)

**Vue d'ensemble :** Puissance de contrôle. Le dashboard se déploie avec des métriques qui pulsent.

**Déroulé :**
- Frame 0-20 : DashboardUI slide depuis la gauche avec stretch horizontal (scaleX 0.3→1)
- Frame 10-50 : Métriques comptent rapidement. Chaque chiffre pulse avec BeatPulse à son apparition
- Frame 10-50 : Bar charts poussent en vague (effet domino)
- Frame 30-60 : "TABLEAU DE BORD TEMPS RÉEL" — KineticWord variant "spread" depuis les bords
- Frame 60-75 : Camera zoom in 1.1× sur le dashboard → flash white 1 frame → transition glitch

**Effet :** Les métriques ne countent pas doucement — elles claquent
**Composants :** DashboardUI (existant + animations accélérées), KineticWord, BeatPulse, CameraShake, TransitionOverlay

---

## Scène 8 — Climax (5s / 150f)

**Vue d'ensemble :** Le grand moment. Split screen des 4 features + typo monumentale + explosion lumineuse.

**Déroulé :**
- Frame 0-40 : SplitFrame 4 quadrants (Solution, Chatbot, Map, Dashboard). Chaque quadrant apparaît en séquence (un tous les 6f) avec effet BLAM (scale 0→1.1→1 avec bounce). Radial burst en fond
- Frame 35-60 : "PROTÉGEZ" — KineticWord variant "zoom" depuis le centre, lettres se déploient en expansion
- Frame 45-70 : "VOS RÉCOLTES" — KineticWord variant "spread" depuis les bords du cadre
- Frame 55-80 : "NOURRISSEZ" — KineticWord variant "drop" depuis le haut, atterrissage heavy avec CameraShake
- Frame 65-90 : "LE MONDE" — KineticWord variant "zoom" avant monumental depuis l'infini
- Frame 85-130 : Les 4 lignes visibles + quadrants en fond. Light burst depuis le centre. Particules explosent dans toutes les directions. CameraShake intense qui decay. Puis ralenti (spring decay)
- Frame 130-150 : Fade progressif vers le noir. Un point lumineux (le centre du logo) reste au centre et se réduit

**C'est le pic émotionnel du trailer.** Tout doit converger ici.
**Composants :** SplitFrame, KineticWord, BeatPulse, CameraShake, ParticleField, TransitionOverlay

---

## Scène 9 — CTA (2.5s / 75f)

**Vue d'ensemble :** Calme après la tempête. Signature finale.

**Déroulé :**
- Frame 0-20 : Logo zoom depuis le point lumineux restant. Scan line rapide (0.5s)
- Frame 15-40 : "L'IA qui protège vos cultures" — KineticWord variant "cascade"
- Frame 30-55 : Store buttons (App Store + Google Play) apparaissent avec fast spring
- Frame 55-75 : Dernier pulse BeatPulse sur le logo. Fade vers centre point → disparition → BLACK

**Ambiance :** Apaisé mais puissant. Le contraste avec le climax doit se sentir.
**Composants :** KineticWord, StoreButtons (existant + animations accélérées), BeatPulse

---

## Timing détaillé

| Scène | Frames | Secondes | Debut | Fin |
|-------|--------|----------|-------|-----|
| Logo | 75 | 2.5 | 0 | 75 |
| *Transition* | 10 | 0.3 | 65 | 75 |
| Problem | 90 | 3.0 | 75 | 165 |
| *Transition* | 10 | 0.3 | 155 | 165 |
| Stats | 90 | 3.0 | 165 | 255 |
| *Transition* | 10 | 0.3 | 245 | 255 |
| Solution | 90 | 3.0 | 255 | 345 |
| *Transition* | 10 | 0.3 | 335 | 345 |
| Chatbot | 90 | 3.0 | 345 | 435 |
| *Transition* | 10 | 0.3 | 425 | 435 |
| Map | 90 | 3.0 | 435 | 525 |
| *Transition* | 10 | 0.3 | 515 | 525 |
| Dashboard | 90 | 3.0 | 525 | 615 |
| *Transition* | 10 | 0.3 | 605 | 615 |
| Climax | 150 | 5.0 | 615 | 765 |
| *Transition* | 12 | 0.4 | 753 | 765 |
| CTA | 75 | 2.5 | 765 | 840 |
| **Total** | **840** | **28.0** | | |

Les transitions sont incluses dans la durée de la scène suivante (overlay sur les dernières frames de la scène précédente).

---

## Structure des fichiers

```
agriscan-remotion/
├── src/
│   ├── AgriScanTrailer.tsx            # MAJ - nouveau timing 840f
│   ├── Root.tsx                       # MAJ - durationInFrames: 840
│   ├── design/
│   │   └── tokens.ts                  # MAJ - SCENE_TIMING v2
│   ├── components/
│   │   ├── (existants conservés)
│   │   ├── CameraShake.tsx            # NOUVEAU
│   │   ├── KineticWord.tsx            # NOUVEAU
│   │   ├── TransitionOverlay.tsx      # NOUVEAU
│   │   ├── DataRain.tsx               # NOUVEAU
│   │   ├── BeatPulse.tsx              # NOUVEAU
│   │   └── SplitFrame.tsx             # NOUVEAU
│   └── scenes/
│       ├── LogoScene.tsx              # REWRITE
│       ├── ProblemScene.tsx           # REWRITE
│       ├── StatsScene.tsx             # REWRITE
│       ├── SolutionScene.tsx          # REWRITE
│       ├── ChatbotScene.tsx           # REWRITE
│       ├── MapScene.tsx               # REWRITE
│       ├── DashboardScene.tsx         # REWRITE
│       ├── ClimaxScene.tsx            # REWRITE
│       └── CTAScene.tsx               # REWRITE
```

---

## Notes techniques

**Transitions :** Chaque scène a une TransitionOverlay sur ses dernières 10-12 frames. L'overlay est absolu et recouvre la fin de la scène + début de la suivante.

**Beat synchro :** Le BeatPulse utilise un BPM de 120 (2 beats/seconde) comme base. Chaque scène peut ajuster. Le climax pourrait utiliser 90 BPM (plus solennel) avec des pulses plus longs.

**CameraShake decay :** Tous les shakes utilisent un pattern : attack rapide (2f) → sustain (5-8f) → decay exponentiel (10-15f).

**KineticWord delays :** Lettres en "explode" : 2f entre chaque lettre. "drop" : 3f. "cascade" : 1.5f. "spread" : 2f. "zoom" : 2.5f.
