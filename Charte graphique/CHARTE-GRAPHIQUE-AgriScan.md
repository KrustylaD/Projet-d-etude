# 🌱 Charte Graphique — AgriScan.ai

> **Version** 1.0 — Mai 2026
> **Projet** Bachelor 2025/2026 · Commandité par la Chambre d'Agriculture
> **Direction créative** SYNAPSE — Dark Tech Cinématique × Nature

---

## Table des matières

1. [Concept & Positionnement](#1-concept--positionnement)
2. [Palette de Couleurs](#2-palette-de-couleurs)
3. [Typographie](#3-typographie)
4. [Logo & Identité](#4-logo--identité)
5. [Espacement & Grille](#5-espacement--grille)
6. [Composants UI](#6-composants-ui)
7. [Effets Visuels & Motion](#7-effets-visuels--motion)
8. [Iconographie](#8-iconographie)
9. [Application Mobile — Écrans de Référence](#9-application-mobile--écrans-de-référence)
10. [Annexes — Variables CSS](#10-annexes--variables-css)

---

## 1. Concept & Positionnement

### 1.1 Identité de marque

| Attribut | Valeur |
|----------|--------|
| **Nom** | AgriScan.ai |
| **Direction** | SYNAPSE |
| **Univers** | IA agricole, diagnostic intelligent, terrain + technologie |
| **Registre** | Dark Tech Cinématique × Nature |
| **Cible primaire** | Agriculteurs (tout âge, familiarité tech variable) |
| **Cible secondaire** | Jury académique, Chambre d'Agriculture |
| **Ton** | Sérieux, moderne, rassurant, expert |
| **Secteur** | AgriTech |

### 1.2 Piliers créatifs

| Pilier | Description |
|--------|-------------|
| **Synapse** | La connexion entre la plante et l'IA — lisibilité, précision, rapidité |
| **Terrain** | L'ancrage agricole — textures, authenticité, rugosité du réel |
| **Technologie** | L'intelligence embarquée — lignes nettes, glow, data visualisation |
| **Confiance** | L'accompagnement expert — palette rassurante, hiérarchie claire, feedback immédiat |

### 1.3 Inspiration visuelle

- Photographie macro de feuilles avec lumière rasante
- Interfaces HUD (heads-up display) agricoles fictives
- Lignes de scan et trames de données superposées à la matière organique
- Code source comme texture décorative (JetBrains Mono, usage parcimonieux)
- Brunures de terrain, humus, rosée, aube

### 1.4 Ce que le design system NE doit PAS être

- Perçu comme "jouet" ou gadget ludique
- Trop froid / dystopique (reste chaleureux grâce au Cream et au Lime)
- Trop agricole traditionnel (pas de vert sapin, pas de marron rustique, pas de bois)
- Confus dans la hiérarchie (l'agriculteur doit comprendre en un coup d'oeil)

---

## 2. Palette de Couleurs

### 2.1 Couleurs principales

#### Black — Fond profond dominant

```
Nom      Black
Hex      #050D07
RGB      5, 13, 7
HSL      135°, 44%, 4%
OKLCH    0.026, 0.014, 167°
```

| Usage | ✅ Autorisé | ❌ Interdit |
|-------|------------|-------------|
| Fond principal écran | Oui — la plupart des écrans | — |
| Texte sur fond clair | Oui (body) | Sur fond sombre < #2A3A2F |
| Cartes | Non (utiliser Slate ou Forest Green) | — |
| Superposition | Oui (overlay modal à 80% opacity) | — |

**Variantes d'opacité**

| % | Hex (sur fond Cream #F9F9F2) | Usage |
|----|------|-------|
| 10% | `rgba(5,13,7,0.10)` | Séparateurs subtils |
| 20% | `rgba(5,13,7,0.20)` | Bordures désactivées |
| 50% | `rgba(5,13,7,0.50)` | Texte secondaire |
| 80% | `rgba(5,13,7,0.80)` | Texte corps |

---

#### Forest Green — Éléments, fond secondaire

```
Nom      Forest Green
Hex      #0A1B0E
RGB      10, 27, 14
HSL      136°, 46%, 7%
OKLCH    0.042, 0.029, 165°
```

| Usage | ✅ Autorisé | ❌ Interdit |
|-------|------------|-------------|
| Fond cartes | Oui | — |
| Fond header | Oui | — |
| Texte | Non (contraste insuffisant sur fond sombre) | Titres sur fond dark |
| Boutons | Non (utiliser Slate ou Lime) | — |
| Badges | Non | — |

**Variantes d'opacité**

| % | Valeur | Usage |
|----|--------|-------|
| 10% | `rgba(10,27,14,0.10)` | Overlay subtil |
| 20% | `rgba(10,27,14,0.20)` | Surface glassmorphism |
| 50% | `rgba(10,27,14,0.50)` | Bordures cards |
| 80% | `rgba(10,27,14,0.80)` | Fond navbar |

---

#### Cream — Textes principaux

```
Nom      Cream
Hex      #F9F9F2
RGB      249, 249, 242
HSL      58°, 37%, 96%
OKLCH    0.975, 0.012, 108°
```

| Usage | ✅ Autorisé | ❌ Interdit |
|-------|------------|-------------|
| Texte corps sur fond sombre | Oui (contraste WCAG AAA) | — |
| Titres sur fond sombre | Oui | — |
| Icônes | Oui (`currentColor`) | — |
| Fond d'écran | Non (sauf écrans clairs spécifiques : onboarding, PDF) | La plupart des écrans |
| Texte sur fond clair | Non (contraste insuffisant) | — |

**Variantes d'opacité**

| % | Valeur | Usage |
|----|--------|-------|
| 10% | `rgba(249,249,242,0.10)` | Bordures subtiles |
| 20% | `rgba(249,249,242,0.20)` | Placeholder, texte désactivé |
| 40% | `rgba(249,249,242,0.40)` | Texte tertiaire, labels |
| 60% | `rgba(249,249,242,0.60)` | Texte secondaire |
| 80% | `rgba(249,249,242,0.80)` | Texte body |
| 100% | `#F9F9F2` | Titres, texte principal |

---

#### Lime — Accents, highlights, CTA

```
Nom      Lime
Hex      #D4FF50
RGB      212, 255, 80
HSL      75°, 100%, 66%
OKLCH    0.93, 0.24, 122°
```

| Usage | ✅ Autorisé | ❌ Interdit |
|-------|------------|-------------|
| CTA principal | Oui — boutons, liens | — |
| Icônes actives | Oui — navigation active | — |
| Indicators | Oui — badges, alerts, focus rings | — |
| Texte long | Non (lisibilité réduite) | Paragraphes |
| Fond large | Non (agressif sur grandes surfaces) | Fond d'écran complet |
| Sur fond clair | Non (contraste insuffisant) | — |

**Variantes d'opacité**

| % | Valeur | Usage |
|----|--------|-------|
| 10% | `rgba(212,255,80,0.10)` | Glow subtil |
| 20% | `rgba(212,255,80,0.20)` | Fond bulle utilisateur, accent hover |
| 40% | `rgba(212,255,80,0.40)` | Glow medium |
| 60% | `rgba(212,255,80,0.60)` | Glow intense |
| 80% | `rgba(212,255,80,0.80)` | Bordure focus |

---

#### Slate — Éléments secondaires

```
Nom      Slate
Hex      #2D3A2F
RGB      45, 58, 47
HSL      132°, 13%, 20%
OKLCH    0.229, 0.021, 155°
```

| Usage | ✅ Autorisé | ❌ Interdit |
|-------|------------|-------------|
| Fond cartes (alternatif) | Oui | — |
| Fond inputs | Oui | — |
| Bordures | Oui | — |
| Fond bulle IA (chatbot) | Oui | — |
| Texte | Non (WCAG AA non atteint sur #050D07) | — |
| CTA | Non | — |

**Variantes d'opacité**

| % | Valeur | Usage |
|----|--------|-------|
| 10% | `rgba(45,58,47,0.10)` | Séparateurs |
| 20% | `rgba(45,58,47,0.20)` | Overlay désactivé |
| 50% | `rgba(45,58,47,0.50)` | Bordures cards |
| 80% | `rgba(45,58,47,0.80)` | Fond input |

---

### 2.2 Couleurs sémantiques

| Nom | Hex | RGB | OKLCH | Usage |
|-----|-----|-----|-------|-------|
| **Success** | `#3AE086` | 58, 224, 134 | `0.73, 0.19, 150°` | Confirmation, diagnostic sain, badge succès |
| **Error** | `#FF4E5C` | 255, 78, 92 | `0.60, 0.25, 21°` | Erreur, maladie critique, alerte rouge |
| **Warning** | `#FFB443` | 255, 180, 67 | `0.78, 0.17, 73°` | Avertissement, maladie modérée, attention |
| **Info** | `#4DAAFF` | 77, 170, 255 | `0.68, 0.15, 255°` | Information, tips, statut neutre |

**Design notes:**
- Les couleurs sémantiques sont délibérément saturées pour se détacher du fond noir profond
- Le Vert (`#3AE086`) est plus froid que le Forest Green pour un contraste sémantique clair
- Le Rouge (`#FF4E5C`) évite le rouge pompier, reste dans le ton tech
- Le Orange (`#FFB443`) est chaleureux sans être agressif

**Variantes de chaque couleur sémantique**

| Couleur | 10% opacity | 20% opacity | 50% opacity |
|---------|-------------|-------------|-------------|
| Success | `rgba(58,224,134,0.10)` | `rgba(58,224,134,0.20)` | `rgba(58,224,134,0.50)` |
| Error | `rgba(255,78,92,0.10)` | `rgba(255,78,92,0.20)` | `rgba(255,78,92,0.50)` |
| Warning | `rgba(255,180,67,0.10)` | `rgba(255,180,67,0.20)` | `rgba(255,180,67,0.50)` |
| Info | `rgba(77,170,255,0.10)` | `rgba(77,170,255,0.20)` | `rgba(77,170,255,0.50)` |

---

### 2.3 Couleurs de surface

| Nom | Hex | Usage |
|-----|-----|-------|
| **Surface Primary** | `#050D07` | Fond d'écran principal (Black) |
| **Surface Secondary** | `#0A1B0E` | Fond carte, bottom sheet, header (Forest Green) |
| **Surface Elevated** | `#0E1F12` | Modal, dialog, popover |
| **Surface Input** | `#2D3A2F` | Champs texte, search bar, textarea (Slate) |
| **Surface Chat User** | `rgba(212,255,80,0.10)` | Bulle utilisateur (chatbot) |
| **Surface Chat AI** | `#2D3A2F` | Bulle IA (chatbot) |
| **Surface Diagnostic** | `#0A1B0E` | Carte résultat diagnostic |
| **Surface Alert Error** | `rgba(255,78,92,0.08)` | Fond alerte erreur |
| **Surface Alert Warning** | `rgba(255,180,67,0.08)` | Fond alerte warning |
| **Surface Alert Success** | `rgba(58,224,134,0.08)` | Fond alerte succès |
| **Overlay Modal** | `rgba(5,13,7,0.80)` | Overlay derrière les modals |

---

### 2.4 Bordures et séparateurs

| Nom | Valeur | Usage |
|-----|--------|-------|
| **Border Default** | `1px solid rgba(249,249,242,0.08)` | Cartes, conteneurs |
| **Border Emphasis** | `1px solid rgba(212,255,80,0.20)` | Cartes actives, focus |
| **Border Input** | `1px solid rgba(249,249,242,0.12)` | Inputs, champs formulaire |
| **Border Input Focus** | `1px solid rgba(212,255,80,0.50)` | Focus ring inputs |
| **Border Error** | `1px solid rgba(255,78,92,0.50)` | Inputs en erreur |
| **Divider** | `1px solid rgba(249,249,242,0.06)` | Séparateurs de liste |
| **Divider Strong** | `1px solid rgba(249,249,242,0.10)` | Séparateurs de section |

---

### 2.5 Contrastes WCAG

| Premier plan | Arrière-plan | Ratio | WCAG AA Texte | WCAG AAA Texte |
|-------------|-------------|-------|:---:|:---:|
| Cream `#F9F9F2` | Black `#050D07` | 18.6:1 | ✅ | ✅ |
| Lime `#D4FF50` | Black `#050D07` | 14.8:1 | ✅ | ✅ |
| Cream `#F9F9F2` | Forest Green `#0A1B0E` | 17.5:1 | ✅ | ✅ |
| Lime `#D4FF50` | Forest Green `#0A1B0E` | 13.9:1 | ✅ | ✅ |
| Cream `#F9F9F2` | Slate `#2D3A2F` | 10.3:1 | ✅ | ✅ |
| Lime `#D4FF50` | Slate `#2D3A2F` | 8.2:1 | ✅ | ✅ |
| Black `#050D07` | Cream `#F9F9F2` | 18.6:1 | ✅ | ✅ |
| Slate `#2D3A2F` | Cream `#F9F9F2` | 6.8:1 | ✅ | ✅ |
| Success `#3AE086` | Black `#050D07` | 9.8:1 | ✅ | ✅ |
| Error `#FF4E5C` | Black `#050D07` | 6.1:1 | ✅ | ✅ |
| Warning `#FFB443` | Black `#050D07` | 8.5:1 | ✅ | ✅ |
| Info `#4DAAFF` | Black `#050D07` | 6.3:1 | ✅ | ✅ |

> **Référence** : WCAG 2.1 — AA ≥ 4.5:1 (texte normal), ≥ 3:1 (grand texte) ; AAA ≥ 7:1 (texte normal), ≥ 4.5:1 (grand texte).

---

### 2.6 Gradients officiels

#### Gradient 1 — AgriScan Hero

Usage : Splash screen, hero sections, fonds cinématiques

```css
background: linear-gradient(135deg, #050D07 0%, #0A1B0E 40%, #122215 100%);
```

#### Gradient 2 — Lime Synapse

Usage : CTA glow, boutons hero, illustrations de marque

```css
background: linear-gradient(135deg, #D4FF50 0%, #A8E030 50%, #6BBF1E 100%);
```

#### Gradient 3 — Scan Data

Usage : Overlay données, arrière-plans chatbot IA, cartes diagnostic

```css
background: linear-gradient(180deg, rgba(212,255,80,0.05) 0%, rgba(5,13,7,0) 100%);
```

#### Gradient 4 — Diagnostic Alert

Usage : Bordures et fonds carte diagnostic critique

```css
background: linear-gradient(135deg, rgba(255,78,92,0.15) 0%, rgba(255,180,67,0.10) 100%);
```

#### Gradient 5 — Glass Card

Usage : Fond des cartes glassmorphism

```css
background: linear-gradient(135deg, rgba(10,27,14,0.60) 0%, rgba(45,58,47,0.40) 100%);
```

---

## 3. Typographie

### 3.1 Polices

#### Plus Jakarta Sans

| Paramètre | Valeur |
|-----------|--------|
| **Source** | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Weights utilisés** | 800 (ExtraBold), 700 (Bold — fallback web) |
| **Rôle** | Titres, headings, logo, navigation |
| **Usage** | Tous les textes de hiérarchie H1→H4, labels navigation |

**Import CSS**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
```

**À ne jamais faire :**
- Ne pas utiliser en dessous de 14px (lisibilité dégradée)
- Ne pas utiliser en Regular (400) — utiliser Inter à la place
- Ne pas utiliser en italique (non fourni dans ces weights)
- Ne pas utiliser pour les paragraphes de corps (trop de personnalité, fatigue visuelle)

---

#### Inter

| Paramètre | Valeur |
|-----------|--------|
| **Source** | [Google Fonts](https://fonts.google.com/specimen/Inter) |
| **Weights utilisés** | 400 (Regular), 500 (Medium) |
| **Rôle** | Corps de texte, labels, UI, formulaires |
| **Usage** | Body, boutons, inputs, listes, tooltips |

**Import CSS**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
```

**À ne jamais faire :**
- Ne pas utiliser en Bold (700)
- Ne pas utiliser pour les titres (utiliser Plus Jakarta Sans)
- Ne pas utiliser en dessous de 12px
- Ne pas utiliser pour les données chiffrées

---

#### JetBrains Mono

| Paramètre | Valeur |
|-----------|--------|
| **Source** | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |
| **Weights utilisés** | 400 (Regular), 700 (Bold) |
| **Rôle** | Données, statistiques, code inline, pourcentages |
| **Usage** | Data display, stats cards, code snippets, chiffres clés |

**Import CSS**
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
```

**À ne jamais faire :**
- Ne pas utiliser pour du texte courant
- Ne pas utiliser pour les titres
- Ne pas utiliser en dessous de 12px
- Ne pas l'utiliser si ce n'est pas une donnée chiffrée/technique

---

### 3.2 Échelle typographique

#### Mobile (base 16px)

| Niveau | Font Family | Weight | Size (rem) | Size (px) | Line-height | Letter-spacing | Usage |
|--------|-------------|--------|------------|-----------|-------------|---------------|-------|
| Display XL | Plus Jakarta Sans | 800 | 3rem | 48px | 1.0 | -0.02em | Splash screen, titre onboarding |
| Display L | Plus Jakarta Sans | 800 | 2.25rem | 36px | 1.1 | -0.015em | Titre diagnostic, hero screen |
| H1 | Plus Jakarta Sans | 800 | 1.75rem | 28px | 1.2 | -0.01em | Titres d'écran |
| H2 | Plus Jakarta Sans | 700 | 1.375rem | 22px | 1.3 | -0.005em | Titres de section |
| H3 | Plus Jakarta Sans | 700 | 1.125rem | 18px | 1.35 | 0 | Sous-sections, titres cartes |
| H4 | Plus Jakarta Sans | 700 | 1rem | 16px | 1.4 | 0 | Titres widgets, labels nav |
| Body Large | Inter | 400 | 1.0625rem | 17px | 1.5 | 0 | Texte onboarding, descriptions |
| Body | Inter | 400 | 0.9375rem | 15px | 1.5 | 0 | Corps standard, chatbot |
| Body Small | Inter | 400 | 0.8125rem | 13px | 1.45 | 0 | Texte secondaire, metadata |
| Caption | Inter | 500 | 0.75rem | 12px | 1.4 | +0.02em | Légendes, crédits |
| Label | Inter | 500 | 0.6875rem | 11px | 1.3 | +0.04em | Labels boutons, badges, tags |
| Overline | Inter | 500 | 0.625rem | 10px | 1.2 | +0.08em | Sur-titres, catégories |
| Data Display | JetBrains Mono | 700 | 2rem | 32px | 1.2 | 0 | Statistiques clés, pourcentages |
| Data Body | JetBrains Mono | 400 | 1rem | 16px | 1.5 | 0 | Données inline, nombres |
| Code Inline | JetBrains Mono | 400 | 0.8125rem | 13px | 1.4 | 0 | Extraits code, termes techniques |

#### Desktop (optionnel, base 16px)

| Niveau | Size (px) | Différence vs mobile |
|--------|-----------|---------------------|
| Display XL | 64px | +33% |
| Display L | 48px | +33% |
| H1 | 36px | +28% |
| H2 | 28px | +27% |
| H3 | 22px | +22% |
| H4 | 18px | +13% |
| Body Large | 18px | +6% |
| Body | 16px | +7% |
| Data Display | 40px | +25% |

---

### 3.3 Règles typographiques

1. **Graisse minimum** : jamais de texte régulier en dessous de 12px (mobile)
2. **Hiérarchie** : au moins 2 niveaux de différence entre les titres consécutifs (éviter H1→H3 sans H2)
3. **Largeur de ligne** : max 65 caractères par ligne en body (mobile)
4. **Contraste obligatoire** : WCAG AA minimum pour tout texte, AAA pour les titres principaux
5. **Mix polices** : maximum 3 polices à l'écran simultanément (hors code)

**Interdictions typographiques :**
- ❌ Titres en Inter
- ❌ Body en Plus Jakarta Sans
- ❌ Données non chiffrées en JetBrains Mono
- ❌ Plus de 2 weights de la même police à l'écran
- ❌ Texte justifié (jamais en mobile)
- ❌ Lettres capitales sur plus de 3 mots consécutifs

---

## 4. Logo & Identité

### 4.1 Construction du logo

#### Symbole

Le logo AgriScan est composé de deux éléments fusionnés dans un **squircle** (border-radius: 28px sur un carré) :

1. **La feuille stylisée** — une forme de feuille végétale simplifiée, tracée en SVG, orientée à 45° vers le haut-droite. La nervure centrale de la feuille est remplacée par une ligne de scan numérique.

2. **Les lignes de scan** — réseau de lignes horizontales parallèles traversant la feuille, d'opacité décroissante de bas en haut, évoquant un scan ou une numérisation.

3. **Le squircle conteneur** — fond Forest Green `#0A1B0E`, bordure subtile `rgba(249,249,242,0.08)`, contient la feuille centrée avec padding interne de 20%.

**Proportions**
```
Taille totale symbole : 64×64px
Zone d'exclusion : 8px autour du symbole (total 80×80px zone protégée)
Taille feuille : ~58% de la largeur du squircle
Épaisseur ligne de scan : 1.5px
```

---

#### Logotype

Le logotype "AgriScan.ai" se compose de :

- **"AgriScan"** — Plus Jakarta Sans 800, letter-spacing: -0.02em, couleur Cream `#F9F9F2`
- **".ai"** — Plus Jakarta Sans 800, couleur Lime `#D4FF50`, accolé sans espace après "AgriScan"

**Alignement logotype/symbole :**
- Horizontal : symbole à gauche, logotype à droite, gap 12px, aligné sur la ligne de base
- Vertical (stacked) : symbole au-dessus, logotype en dessous, gap 8px, centré

---

### 4.2 Variantes officielles

#### Primaire — Cream sur Forest Green

```css
/* Fond : Forest Green */
background: #0A1B0E;
/* Symbole : Cream #F9F9F2 */
/* Logotype : Cream #F9F9F2 + .ai en Lime #D4FF50 */
```

Usage : Header app, navbar, cartes, documents print (si fond clair)

---

#### Glow — Splash Screen

```css
/* Fond : Black #050D07 */
background: #050D07;
/* Symbole : Cream #F9F9F2 + box-shadow glow Lime */
box-shadow: 0 0 40px rgba(212,255,80,0.25),
            0 0 80px rgba(212,255,80,0.10);
/* Logotype : Cream #F9F9F2 + .ai en Lime #D4FF50 */
```

Usage : Splash screen UNIQUEMENT

---

#### Monochrome — Noir

```css
/* Fond : transparent ou clair */
/* Symbole : Black #050D07 */
/* Logotype : Black #050D07 */
```

Usage : Documents print N&B, factures, filigrane

---

#### Monochrome — Blanc

```css
/* Fond : transparent ou sombre */
/* Symbole : Cream #F9F9F2 */
/* Logotype : Cream #F9F9F2 */
```

Usage : Sur fonds sombres sans Lime, partenariats

---

#### Icône seule — App Icon

```css
/* Fond : Forest Green #0A1B0E (squircle plein) */
/* Symbole : feuille + scan en Lime #D4FF50 */
/* Pas de logotype */
```

Usage : Icône d'application mobile, favicon, notifications

**Tailles d'export :**
- 1024×1024px (App Store)
- 512×512px (Google Play)
- 192×192px (PWA)
- 64×64px (favicon)
- 48×48px, 32×32px, 24×24px, 16×16px (usage général)

---

### 4.3 Zone d'exclusion

```
┌─────────────────────────────────────────┐
│                                         │
│     ╔═══════════════════════════╗        │
│     ║                         ║        │
│     ║   ┌─────────┐           ║        │
│     ║   │ SQUIRCLE│   AgriScan.ai  ║   │
│     ║   └─────────┘           ║        │
│     ║                         ║        │
│     ╚═══════════════════════════╝        │
│        Zone d'exclusion (X)              │
└─────────────────────────────────────────┘
```

- **X** = hauteur du symbole × 0.5 (minimum 24px)
- Aucun élément graphique, texte, ou bordure d'écran ne doit pénétrer cette zone

---

### 4.4 Tailles minimales

| Support | Largeur minimale logo complet | Hauteur minimale icône seule |
|---------|------------------------------|------------------------------|
| Print (300 dpi) | 28mm | 8mm |
| Digital mobile | 120px | 48px |
| Digital desktop | 160px | 48px |
| Favicon | — | 16px |
| App icon | — | 48px (Android), 60px (iOS) |

---

### 4.5 Usages interdits

- ❌ Déformer le logo (ratio locké à 1:1 pour le symbole)
- ❌ Changer les couleurs du logo en dehors des variantes officielles
- ❌ Ajouter une ombre portée autre que le Glow (variante splash screen)
- ❌ Faire pivoter le logo
- ❌ Utiliser le symbole sans le squircle conteneur
- ❌ Placer le logo sur un fond qui n'offre pas un contraste minimum WCAG AA (3:1)
- ❌ Changer la police du logotype
- ❌ Ajouter un slogan ou sous-texte dans le logo
- ❌ Utiliser l'icône seule (app icon) sans le squircle plein
- ❌ Appliquer un flou ou une distorsion

---

## 5. Espacement & Grille

### 5.1 Unité de base

L'unité de base est **4px**. Tous les espacements, dimensions et rayons doivent être des multiples de 4.

```
Unité (u) : 4px
0.5u = 2px   (exceptions : bordures 1px)
1u   = 4px
2u   = 8px
3u   = 12px
4u   = 16px
6u   = 24px
8u   = 32px
10u  = 40px
12u  = 48px
16u  = 64px
20u  = 80px
24u  = 96px
```

### 5.2 Échelle d'espacement

| Token | Valeur | Usage |
|-------|--------|-------|
| `space-0` | 0 | Aucun espacement |
| `space-xs` | 4px (1u) | Inner padding tight, icônes dans boutons |
| `space-sm` | 8px (2u) | Gap interne, listes denses |
| `space-md` | 12px (3u) | Padding carte, gap éléments formulaire |
| `space-lg` | 16px (4u) | Padding écran, gap sections |
| `space-xl` | 24px (6u) | Entre sections, margin bottom titres |
| `space-2xl` | 32px (8u) | Header height, bottom tab height |
| `space-3xl` | 48px (12u) | Hero spacing, onboarding padding |
| `space-4xl` | 64px (16u) | Splash screen, grands écrans |

---

### 5.3 Grilles

#### Mobile (360—414px)

```
┌───────┬───────────────────────────────────────┬───────┐
│       │                                       │       │
│  16px │  4 colonnes, gutter 12px              │  16px │
│margin │  (col = (width - 32 - 36) / 4)        │margin │
│       │                                       │       │
└───────┴───────────────────────────────────────┴───────┘
```

- Colonnes : 4
- Gutters : 12px (3u)
- Margins : 16px (4u)
- Largeur max contenu : 100%

#### Tablette (768—1024px)

```
┌───────┬─────────────────────────────────────────────────────┬───────┐
│       │                                                     │       │
│  24px │  8 colonnes, gutter 16px                            │  24px │
│margin │  (col = (width - 48 - 112) / 8)                     │margin │
│       │                                                     │       │
└───────┴─────────────────────────────────────────────────────┴───────┘
```

- Colonnes : 8
- Gutters : 16px (4u)
- Margins : 24px (6u)

#### Desktop (≥1280px)

```
┌───────┬─────────────────────────────────────────────────────────────┬───────┐
│       │                                                             │       │
│  auto │  12 colonnes, gutter 24px, max-width 1280px centré           │  auto │
│margin │  (col = (1280 - 264) / 12 ≈ 84.7px)            │margin     │
│       │                                                             │       │
└───────┴─────────────────────────────────────────────────────────────┴───────┘
```

- Colonnes : 12
- Gutters : 24px (6u)
- Largeur max contenu : 1280px (centré)
- Margins : auto

---

### 5.4 Border Radius System

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius-none` | 0 | Tables, data grids |
| `radius-sm` | 4px (1u) | Inputs, badges, tags, chips |
| `radius-md` | 8px (2u) | Cartes, boutons, list items |
| `radius-lg` | 12px (3u) | Modals, sheets, grandes cartes |
| `radius-xl` | 16px (4u) | Hero images, illustrations |
| `radius-squircle` | 28px | Logo, app icon |
| `radius-full` | 9999px | Pills, avatars, indicators |

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-squircle: 28px;
  --radius-full: 9999px;
}
```

---

### 5.5 Système d'ombres (Shadows)

AgriScan utilise des ombres subtiles sur fond sombre — pas d'ombres portées classiques (peu visibles sur #050D07), mais des **glows** et **ring shadows**.

| Token | Valeur CSS | Usage |
|-------|------------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.30)` | Boutons, inputs (relief minimal) |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.40)` | Cartes, modals |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.50)` | Sheets, popovers |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.60)` | Modals plein écran |
| `glow-subtle` | `0 0 10px rgba(212,255,80,0.10)` | Accents légers |
| `glow-medium` | `0 0 20px rgba(212,255,80,0.15)` | Boutons CTA, badges actifs |
| `glow-intense` | `0 0 40px rgba(212,255,80,0.25)` | Logo splash, diagnostic critique |
| `glow-error` | `0 0 20px rgba(255,78,92,0.20)` | Alertes critiques |
| `glow-success` | `0 0 20px rgba(58,224,134,0.20)` | Confirmation, succès |

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.40);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.50);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.60);
  --glow-subtle: 0 0 10px rgba(212, 255, 80, 0.10);
  --glow-medium: 0 0 20px rgba(212, 255, 80, 0.15);
  --glow-intense: 0 0 40px rgba(212, 255, 80, 0.25);
  --glow-error: 0 0 20px rgba(255, 78, 92, 0.20);
  --glow-success: 0 0 20px rgba(58, 224, 134, 0.20);
}
```

---

### 5.6 Échelle Z-Index

| Token | Valeur | Usage |
|-------|--------|-------|
| `z-base` | 0 | Contenu standard |
| `z-dropdown` | 100 | Dropdowns, selects |
| `z-sticky` | 200 | Headers, tab bars |
| `z-overlay` | 300 | Overlays modals |
| `z-modal` | 400 | Modals, dialogs |
| `z-popover` | 500 | Tooltips, popovers |
| `z-toast` | 600 | Toasts, notifications |
| `z-max` | 999 | Loader plein écran, splash screen |

---

## 6. Composants UI

### 6.1 Boutons

#### Tailles

| Taille | Height | Padding X | Font | Border-radius | Icon size |
|--------|--------|-----------|------|---------------|-----------|
| **sm** | 32px (8u) | 12px (3u) | Label 11px | `radius-sm` (4px) | 14px |
| **md** | 44px (11u) | 20px (5u) | Body Small 13px | `radius-md` (8px) | 18px |
| **lg** | 52px (13u) | 28px (7u) | Body 15px | `radius-md` (8px) | 22px |

---

#### Primary — Fond Lime

```css
/* Default */
background: #D4FF50;
color: #050D07;
font-family: 'Inter', sans-serif;
font-weight: 500;
border: none;
border-radius: var(--radius-md);
box-shadow: var(--glow-subtle);
cursor: pointer;
transition: all 150ms ease-out;

/* Hover */
background: #C5F030;
box-shadow: var(--glow-medium);

/* Active */
background: #B0E020;
box-shadow: none;
transform: scale(0.97);

/* Focus */
outline: 2px solid rgba(212,255,80,0.50);
outline-offset: 2px;

/* Disabled */
background: rgba(212,255,80,0.15);
color: rgba(5,13,7,0.30);
box-shadow: none;
pointer-events: none;
```

---

#### Secondary — Outline Lime

```css
/* Default */
background: transparent;
color: #D4FF50;
font-family: 'Inter', sans-serif;
font-weight: 500;
border: 1px solid rgba(212,255,80,0.40);
border-radius: var(--radius-md);
cursor: pointer;
transition: all 150ms ease-out;

/* Hover */
background: rgba(212,255,80,0.08);
border-color: rgba(212,255,80,0.60);

/* Active */
background: rgba(212,255,80,0.15);
border-color: #D4FF50;
transform: scale(0.97);

/* Focus */
outline: 2px solid rgba(212,255,80,0.50);
outline-offset: 2px;

/* Disabled */
color: rgba(212,255,80,0.15);
border-color: rgba(212,255,80,0.08);
pointer-events: none;
```

---

#### Ghost — Sans bordure

```css
/* Default */
background: transparent;
color: #D4FF50;
font-family: 'Inter', sans-serif;
font-weight: 500;
border: none;
border-radius: var(--radius-md);
cursor: pointer;
transition: all 150ms ease-out;

/* Hover */
background: rgba(212,255,80,0.08);

/* Active */
background: rgba(212,255,80,0.15);
transform: scale(0.97);

/* Focus */
outline: 2px solid rgba(212,255,80,0.50);
outline-offset: 2px;

/* Disabled */
color: rgba(212,255,80,0.15);
pointer-events: none;
```

---

#### Danger

```css
/* Default */
background: #FF4E5C;
color: #F9F9F2;
font-family: 'Inter', sans-serif;
font-weight: 500;
border: none;
border-radius: var(--radius-md);
cursor: pointer;
transition: all 150ms ease-out;

/* Hover */
background: #E64450;
box-shadow: var(--glow-error);

/* Disabled */
background: rgba(255,78,92,0.15);
color: rgba(249,249,242,0.30);
pointer-events: none;
```

---

#### Icônes dans les boutons

```css
/* Icône à gauche */
.button-icon-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Icône seule (carré) */
.button-icon-only {
  padding: 0;
  width: 44px; /* ou 32px (sm), 52px (lg) */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

### 6.2 Inputs

#### Text Input

```css
/* Default */
background: #2D3A2F;
color: #F9F9F2;
font-family: 'Inter', sans-serif;
font-size: 0.9375rem; /* Body */
font-weight: 400;
line-height: 1.5;
border: 1px solid rgba(249,249,242,0.12);
border-radius: var(--radius-sm);
padding: 10px 12px;
height: 44px;
transition: border-color 150ms ease-out;
caret-color: #D4FF50;

/* Placeholder */
::placeholder {
  color: rgba(249,249,242,0.30);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

/* Focus */
border-color: rgba(212,255,80,0.50);
outline: none;
box-shadow: 0 0 0 2px rgba(212,255,80,0.10);

/* Error */
border-color: rgba(255,78,92,0.50);
box-shadow: 0 0 0 2px rgba(255,78,92,0.08);

/* Success */
border-color: rgba(58,224,134,0.50);
box-shadow: 0 0 0 2px rgba(58,224,134,0.08);

/* Disabled */
background: rgba(45,58,47,0.30);
color: rgba(249,249,242,0.20);
border-color: transparent;
pointer-events: none;
```

#### Label

```css
.label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.6875rem; /* Label */
  color: rgba(249,249,242,0.60);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
```

#### Message d'erreur

```css
.error-message {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.75rem; /* Caption */
  color: #FF4E5C;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

#### Textarea

Mêmes specs que le Text Input, sauf :
- `height` : 120px (minimum), redimensionnable verticalement uniquement
- `line-height` : 1.6

```css
textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}
```

---

### 6.3 Cards

#### Card Standard — Glassmorphism

```css
.card {
  background: linear-gradient(135deg, rgba(10,27,14,0.60), rgba(45,58,47,0.40));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(249,249,242,0.06);
  border-radius: var(--radius-md); /* 8px */
  padding: 16px;
  transition: border-color 300ms ease-out;
}

.card:hover {
  border-color: rgba(212,255,80,0.15);
}
```

#### Card Alerte — Bordure sémantique

```css
.card-alert-error {
  background: rgba(255,78,92,0.06);
  border: 1px solid rgba(255,78,92,0.25);
  border-radius: var(--radius-md);
  padding: 16px;
}

.card-alert-warning {
  background: rgba(255,180,67,0.06);
  border: 1px solid rgba(255,180,67,0.25);
  border-radius: var(--radius-md);
  padding: 16px;
}

.card-alert-success {
  background: rgba(58,224,134,0.06);
  border: 1px solid rgba(58,224,134,0.25);
  border-radius: var(--radius-md);
  padding: 16px;
}
```

#### Card Diagnostic — Résultat IA

```css
.card-diagnostic {
  background: linear-gradient(135deg, rgba(10,27,14,0.80), rgba(45,58,47,0.50));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212,255,80,0.12);
  border-radius: var(--radius-lg); /* 12px */
  padding: 24px;
  box-shadow: var(--glow-subtle);
}

.card-diagnostic-critical {
  border-color: rgba(255,78,92,0.30);
  box-shadow: var(--glow-error);
  background: linear-gradient(135deg, rgba(255,78,92,0.08), rgba(10,27,14,0.90));
}
```

#### Card Stat — JetBrains Mono

```css
.card-stat {
  background: linear-gradient(135deg, rgba(10,27,14,0.60), rgba(45,58,47,0.40));
  border: 1px solid rgba(249,249,242,0.06);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
}

.card-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 2rem;
  color: #D4FF50;
  line-height: 1.2;
}

.card-stat-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.6875rem;
  color: rgba(249,249,242,0.40);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
}
```

---

### 6.4 Badges & Tags

```css
/* Badge de base */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.625rem; /* 10px */
  line-height: 1;
  padding: 4px 8px;
  border-radius: var(--radius-sm); /* 4px */
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Variantes */
.badge-success {
  background: rgba(58,224,134,0.12);
  color: #3AE086;
}

.badge-error {
  background: rgba(255,78,92,0.12);
  color: #FF4E5C;
}

.badge-warning {
  background: rgba(255,180,67,0.12);
  color: #FFB443;
}

.badge-info {
  background: rgba(77,170,255,0.12);
  color: #4DAAFF;
}

/* Tags (border-radius plus grand) */
.tag {
  border-radius: var(--radius-full); /* 9999px */
  padding: 4px 12px;
}

.tag-maladie {
  background: rgba(255,78,92,0.10);
  color: #FF4E5C;
  border: 1px solid rgba(255,78,92,0.25);
}

.tag-culture {
  background: rgba(58,224,134,0.10);
  color: #3AE086;
  border: 1px solid rgba(58,224,134,0.25);
}
```

---

### 6.5 Chatbot UI

#### Bulle Utilisateur — Droite

```css
.message-user {
  align-self: flex-end;
  max-width: 80%;
  background: rgba(212,255,80,0.10);
  border: 1px solid rgba(212,255,80,0.15);
  border-radius: 12px 12px 4px 12px;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.9375rem;
  color: #F9F9F2;
  line-height: 1.5;
}
```

#### Bulle IA — Gauche

```css
.message-ai {
  align-self: flex-start;
  max-width: 85%;
  background: #2D3A2F;
  border: 1px solid rgba(249,249,242,0.06);
  border-radius: 12px 12px 12px 4px;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.9375rem;
  color: #F9F9F2;
  line-height: 1.5;
}
```

#### Message Système — Centré

```css
.message-system {
  align-self: center;
  max-width: 90%;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: rgba(249,249,242,0.30);
  text-align: center;
  padding: 6px 12px;
}
```

#### Typing Indicator — 3 points animés

```css
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: #2D3A2F;
  border-radius: 12px 12px 12px 4px;
  max-width: 60px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(249,249,242,0.30);
  animation: typing-bounce 1.4s ease-in-out infinite both;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
  40% { transform: translateY(-4px); opacity: 0.8; }
}
```

---

### 6.6 Navigation

#### Tab Bar Mobile

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(10,27,14,0.90);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(249,249,242,0.06);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  z-index: 200;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  min-width: 48px;
  color: rgba(249,249,242,0.30);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.625rem;
  transition: color 150ms ease-out;
}

.tab-item.active {
  color: #D4FF50;
}
```

**Items max : 5** (pas plus dans la tab bar)

#### Header avec Logo

```css
.header {
  position: sticky;
  top: 0;
  height: 56px;
  background: rgba(5,13,7,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(249,249,242,0.06);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 200;
}

.header-logo {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

#### Back Button

```css
.back-button {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: rgba(249,249,242,0.60);
  border: none;
  border-radius: var(--radius-full);
  transition: background 150ms ease-out, color 150ms ease-out;
}

.back-button:hover {
  background: rgba(249,249,242,0.06);
  color: #F9F9F2;
}
```

---

## 7. Effets Visuels & Motion

### 7.1 Glassmorphism

Propriétés standard pour tous les composants utilisant l'effet verre :

```css
.glass {
  background: rgba(10, 27, 14, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(249, 249, 242, 0.06);
}
```

| Niveau | blur() | background alpha | Usage |
|--------|--------|-----------------|-------|
| **Subtle** | 8px | `rgba(10,27,14,0.40)` | Cartes inline |
| **Standard** | 12px | `rgba(10,27,14,0.55)` | Cartes principales |
| **Heavy** | 20px | `rgba(10,27,14,0.70)` | Modals, bottom sheets |
| **Extreme** | 28px | `rgba(5,13,7,0.85)` | Header, tab bar |

> **Note** : Sur les navigateurs ne supportant pas `backdrop-filter`, fallback sur un fond opaque `#0A1B0E`.

---

### 7.2 Glow Effects

```css
/* Subtle — accents discrets */
.glow-subtle {
  box-shadow: 0 0 10px rgba(212, 255, 80, 0.10);
}

/* Medium — boutons CTA, badges actifs */
.glow-medium {
  box-shadow: 0 0 20px rgba(212, 255, 80, 0.15);
}

/* Intense — logo splash, éléments hero */
.glow-intense {
  box-shadow: 0 0 40px rgba(212, 255, 80, 0.25),
              0 0 80px rgba(212, 255, 80, 0.08);
}
```

**Règles d'usage :**
- Pas plus d'UN élément avec `glow-intense` visible à l'écran simultanément
- Le glow doit toujours être animé avec une pulsation subtile en splash screen
- Les glows ne traversent jamais d'autres éléments (utiliser `overflow: hidden` si nécessaire)

---

### 7.3 Grain / Noise Overlay

Un overlay de grain/bruit superposé à l'ensemble de l'application pour la texture cinématique :

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 998;
  opacity: 0.03; /* 3% — très subtil */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1' /%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

**À ne pas appliquer sur :**
- Les textes uniquement (préférer un conteneur parent)
- Les images en plein écran (le grain n'est pas au premier plan)

---

### 7.4 Scanline Effect

Lignes de scan horizontales pour les écrans de diagnostic :

```css
.scanlines {
  position: relative;
  overflow: hidden;
}

.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  z-index: 1;
}
```

Usage : Uniquement sur les cartes de diagnostic et l'écran de résultat IA. Ne pas utiliser sur le chatbot ou la navigation.

---

### 7.5 Animations Standard

#### Durées

| Token | Valeur | Usage |
|-------|--------|-------|
| `duration-fast` | 150ms | Micro-interactions, hover, focus, toggle |
| `duration-normal` | 300ms | Transitions d'écran, ouverture modale, apparition |
| `duration-slow` | 600ms | Animations hero, splash screen, onboarding |

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
}
```

#### Easings officiels

| Nom | cubic-bezier() | Usage |
|-----|---------------|-------|
| **Ease Out** | `cubic-bezier(0.16, 1, 0.3, 1)` | Apparitions, transitions standard |
| **Ease In** | `cubic-bezier(0.4, 0, 1, 1)` | Disparitions |
| **Ease In Out** | `cubic-bezier(0.65, 0, 0.35, 1)` | Mouvements continus |
| **Spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Feedback tactile, scale on press |

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

#### Transitions d'écran

```css
/* Navigation push (standard) */
.screen-enter {
  animation: slide-in-right 300ms var(--ease-out);
}

.screen-exit {
  animation: slide-out-left 300ms var(--ease-in);
}

@keyframes slide-in-right {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}

/* Modal (bottom sheet) */
.modal-enter {
  animation: slide-up 300ms var(--ease-out);
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Fade */
.fade-enter {
  animation: fade-in 150ms var(--ease-out);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

### 7.6 Micro-interactions

#### Bouton — Press Feedback

```css
.button:active {
  transform: scale(0.97);
  transition: transform 150ms var(--ease-spring);
}
```

#### Input — Focus Glow

```css
.input:focus {
  border-color: rgba(212,255,80,0.50);
  box-shadow: 0 0 0 2px rgba(212,255,80,0.10);
  transition: border-color 150ms var(--ease-out),
              box-shadow 150ms var(--ease-out);
}
```

#### Tab Bar — Indicateur actif

```css
.tab-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #D4FF50;
  opacity: 0;
  transform: scale(0);
  transition: opacity 150ms var(--ease-out),
              transform 150ms var(--ease-spring);
}

.tab-item.active .tab-indicator {
  opacity: 1;
  transform: scale(1);
}
```

#### Badge — Notification Pulse

```css
.badge-pulse {
  animation: badge-pulse 2s var(--ease-in-out) infinite;
}

@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,255,80,0.40); }
  50% { box-shadow: 0 0 0 6px rgba(212,255,80,0); }
}
```

---

## 8. Iconographie

### 8.1 Librairie principale

| Paramètre | Valeur |
|-----------|--------|
| **Librairie** | [Lucide Icons](https://lucide.dev) |
| **Format** | SVG inline |
| **Stroke width** | 1.5px (standard), 2px (emphasis) |
| **Couleur** | `currentColor` (hérite du contexte) |
| **Tailles** | 16px, 20px, 24px, 32px |

```css
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 1.5px;
  color: inherit;
  flex-shrink: 0;
}

.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }

.icon-emphasis {
  stroke-width: 2px;
}
```

**Règles :**
- Toujours utiliser `currentColor` pour que l'icône hérite de la couleur du texte parent
- Ne pas mélanger stroke-width 1.5px et 2px dans le même contexte visuel
- Les icônes ne doivent jamais dépasser 32px (mobile)
- Pas d'icônes colorées autrement que via `currentColor`

---

### 8.2 Icônes Lucide — Mapping standard

| Fonction | Icône Lucide |
|----------|-------------|
| Home / Dashboard | `layout-dashboard` |
| Diagnostic / Scanner | `scan` |
| Historique | `history` |
| Profil | `user` |
| Paramètres | `settings` |
| Retour | `arrow-left` |
| Fermer | `x` |
| Menu / Plus | `more-horizontal` |
| Recherche | `search` |
| Alerte | `alert-triangle` |
| Succès / Check | `check-circle-2` |
| Erreur / Danger | `x-circle` |
| Info | `info` |
| Photo / Upload | `camera` |
| Envoyer | `send` |
| Microphone | `mic` |
| Plante / Culture | `sprout` |
| Localisation | `map-pin` |
| Météo | `cloud-sun` |
| Filtre | `sliders-horizontal` |
| Télécharger | `download` |
| Partager | `share-2` |
| Notifications | `bell` |
| Horloge | `clock` |

---

### 8.3 Icônes Custom AgriScan

Ces icônes spécifiques au domaine agricole et au diagnostic IA doivent être créées sur mesure :

#### Feuille malade — `leaf-diseased`

SVG 24×24, stroke 1.5px :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
  stroke-linejoin="round">
  <!-- Forme de feuille -->
  <path d="M12 2C8 6 4 10 4 14c0 4 3.5 7 8 7s8-3 8-7c0-4-4-8-8-12z"/>
  <!-- Nervure centrale -->
  <path d="M12 2v19"/>
  <!-- Taches de maladie -->
  <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" opacity="0.6"/>
  <circle cx="14" cy="13" r="2" fill="currentColor" stroke="none" opacity="0.5"/>
  <circle cx="10" cy="16" r="1" fill="currentColor" stroke="none" opacity="0.4"/>
  <!-- Traitement visuel scan -->
  <path d="M6 9h3M15 11h3M7 16h2" stroke-dasharray="2 1.5" opacity="0.5"/>
</svg>
```

**Couleur** : `currentColor`, à utiliser en Error `#FF4E5C` pour les alertes.

---

#### Scan — `scan-agri`

SVG 24×24, stroke 1.5px :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
  stroke-linejoin="round">
  <!-- Cadre scanner -->
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <!-- Coins renforcés -->
  <path d="M3 8h3M18 8h3M3 16h3M18 16h3" stroke-width="2.5"/>
  <!-- Ligne de scan -->
  <line x1="3" y1="12" x2="21" y2="12" stroke="#D4FF50" stroke-width="1"/>
  <!-- Points de scan animés -->
  <circle cx="8" cy="12" r="1" fill="#D4FF50" stroke="none"/>
  <circle cx="12" cy="12" r="1.5" fill="#D4FF50" stroke="none"/>
  <circle cx="16" cy="12" r="1" fill="#D4FF50" stroke="none"/>
</svg>
```

**Couleur** : La ligne de scan et points en Lime `#D4FF50`, le cadre en `currentColor`.

---

#### Diagnostic IA — `brain-circuit`

SVG 24×24, stroke 1.5px :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
  stroke-linejoin="round">
  <!-- Silhouette cerveau/IA -->
  <path d="M12 3c-2.5 0-4.5 2-4.5 4.5 0 1.2.5 2.3 1.3 3.2C7.2 11.3 5.5 12.5 5 14.5 4.5 16.5 5.5 19 7 20c1 .7 2.3 1 3.5 1h3c1.2 0 2.5-.3 3.5-1 1.5-1 2.5-3.5 2-5.5-.5-2-2.2-3.2-3.8-3.8.8-.9 1.3-2 1.3-3.2C16.5 5 14.5 3 12 3z"/>
  <!-- Noeuds circuit -->
  <circle cx="9" cy="8" r="1.5" stroke="none" fill="#D4FF50"/>
  <circle cx="15" cy="8" r="1.5" stroke="none" fill="#D4FF50"/>
  <circle cx="12" cy="14" r="2" stroke="none" fill="#D4FF50" opacity="0.6"/>
  <!-- Connexions -->
  <path d="M9 8l3 6M15 8l-3 6" stroke="#D4FF50" stroke-width="1.5" opacity="0.5"/>
</svg>
```

---

#### Parcelle — `field-plot`

SVG 24×24, stroke 1.5px :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
  stroke-linejoin="round">
  <!-- Périmètre parcelle -->
  <path d="M3 7l18-4v14L3 21V7z"/>
  <!-- Division interne -->
  <path d="M3 14l18-4" stroke-dasharray="2 2" opacity="0.5"/>
  <!-- Plantes stylisées -->
  <path d="M7 10l.5-2M11 9l.5-2M15 8l.5-1.5M19 7l.5-1.5"/>
  <!-- Points GPS -->
  <circle cx="3" cy="7" r="1" fill="#D4FF50" stroke="none"/>
  <circle cx="21" cy="3" r="1" fill="#D4FF50" stroke="none"/>
  <circle cx="3" cy="21" r="1" fill="#D4FF50" stroke="none"/>
  <circle cx="21" cy="17" r="1" fill="#D4FF50" stroke="none"/>
</svg>
```

---

#### Alerte culture — `crop-alert`

SVG 24×24, stroke 1.5px :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
  stroke-linejoin="round">
  <!-- Blé stylisé -->
  <path d="M12 20V10M12 10c-1 0-2-1-2-3s1-5 2-6c1 1 2 3 2 6s-1 3-2 3z"/>
  <path d="M10 7l-3-1M14 7l3-1"/>
  <!-- Triangle alerte -->
  <path d="M12 20l-6 3h12l-6-3z" fill="none"/>
  <!-- Point exclamation -->
  <path d="M12 18v1M12 18" stroke-width="2.5"/>
  <!-- Glow alerte -->
  <circle cx="12" cy="20" r="8" fill="none" stroke="#FFB443" stroke-width="0.5" opacity="0.4"/>
</svg>
```

**Couleur** : Cercle d'alerte en Warning `#FFB443`.

---

## 9. Application Mobile — Écrans de Référence

### 9.1 Splash Screen

```
┌──────────────────────────────────────┐
│                                      │
│           ░░░░░░░░░░░░░░             │
│          ░░░░░░░░░░░░░░░░            │  ← Grain overlay (3%)
│         ░░░░░░░░░░░░░░░░░░           │
│         ░░░░░┌────────┐░░░░░         │
│         ░░░░░│ SQUIRCLE│░░░░░         │  ← Logo Glow variant
│         ░░░░░│  FEUILLE │░░░░░         │     box-shadow: glow-intense
│         ░░░░░│  + SCAN │░░░░░         │     animation: logo-pulse 2s infinite
│         ░░░░░└────────┘░░░░░         │
│         ░░░░░░░░░░░░░░░░░░           │
│         ░░░░ AgriScan.ai ░░░░        │  ← Logotype Lime ".ai"
│         ░░░░░░░░░░░░░░░░░░           │
│          ░░░░░░░░░░░░░░░░            │
│           ░░░░░░░░░░░░░░             │
│                                      │
│      ═══════════════════════         │  ← Scanline animé
│                                      │
│           Chambre d'Agriculture      │  ← Caption, opacity 30%
│                                      │
└──────────────────────────────────────┘
```

| Élément | Spécification |
|---------|---------------|
| **Fond** | Black `#050D07` |
| **Logo** | Variante Glow, centré vertical et horizontal |
| **Animation logo** | Pulse glow : opacity 0.6→1→0.6, durée 2s, ease-in-out, infinite |
| **Scanline** | Ligne horizontale Lime `#D4FF50`, opacity 0.3, width 60%, centrée |
| **Animation scanline** | TranslateY de -60px à +60px, durée 3s, ease-in-out, infinite |
| **Texte footer** | "Chambre d'Agriculture" — Caption, Cream 30% opacity |
| **Durée splash** | 2 secondes puis transition fade-out 300ms vers Onboarding |
| **Grain** | Overlay 3% sur tout l'écran |

```css
@keyframes logo-pulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(212,255,80,0.25),
                0 0 80px rgba(212,255,80,0.08);
  }
  50% {
    box-shadow: 0 0 60px rgba(212,255,80,0.40),
                0 0 120px rgba(212,255,80,0.15);
  }
}

@keyframes scanline-move {
  from { transform: translateY(-60px); }
  to { transform: translateY(60px); }
}
```

---

### 9.2 Onboarding

3 slides horizontaux, swipe navigation.

#### Slide 1 — Le Problème

```
┌──────────────────────────────────────┐
│  [Skip]                        (1/3) │  ← Caption right
│                                      │
│   ┌──────────────────────────┐       │
│   │                          │       │
│   │   ILLUSTRATION           │       │  ← Hero 240×240px
│   │   Feuille malade         │       │     style cinématique
│   │   Macro photo + scan     │       │
│   │                          │       │
│   └──────────────────────────┘       │
│                                      │
│   Vos cultures                    │  ← Display L
│   sont-elles                       │     Plus Jakarta Sans 800
│   en danger ?                      │
│                                      │
│   Chaque jour, des maladies      │  ← Body Large
│   menacent vos rendements.         │     Inter 400
│   Diagnostiquez-les avant          │     Cream 60% opacity
│   qu'il ne soit trop tard.         │
│                                      │
│                                      │
│         ● ○ ○  ← Page dots          │
│                                      │
│   ┌──────────────────────────┐       │
│   │       Continuer  →       │       │  ← Button Primary lg
│   └──────────────────────────┘       │
└──────────────────────────────────────┘
```

**Palette appliquée :**
- Fond : Black `#050D07`
- Titre : Cream `#F9F9F2`
- Body : Cream 60%
- Illustration : Forest Green en fond, Lime en accents
- Bouton : Primary Lime

**Typographie :**
- Titre : Display L, Plus Jakarta Sans 800
- Corps : Body Large, Inter 400
- Skip : Caption, Inter 500, Cream 30%
- Page dots : Cream 20% (inactif), Lime (actif)

---

#### Slide 2 — La Solution

Même layout que Slide 1.

- **Illustration** : Téléphone affichant l'interface de scan, avec lignes de scan Lime
- **Titre** : "L'IA au service\nde votre exploitation"
- **Corps** : "Prenez une photo, notre IA analyse\net vous donne un diagnostic\nen quelques secondes."

#### Slide 3 — L'Action

Même layout que Slide 1.

- **Illustration** : Dashboard simplifié, statistiques, icône feuille saine
- **Titre** : "Protégez vos récoltes,\noptimisez vos traitements"
- **Corps** : "Des recommandations précises\npour chaque maladie détectée.\nÉconomisez temps et intrants."
- **Bouton** : "Commencer" (Primary lg)

**UX notes onboarding :**
- Swipe horizontal entre les slides
- Animation de transition : slide 300ms ease-out
- Le bouton "Commencer" sur le slide 3 déclenche la navigation vers Home
- "Skip" en haut à droite sur tous les slides → va directement au Home
- Page dots en bas, au-dessus du bouton
- L'onboarding ne s'affiche qu'au premier lancement

---

### 9.3 Home Dashboard

```
┌──────────────────────────────────────┐
│  ┌────┐              ┌───┐ ┌──────┐  │
│  │Logo│ AgriScan.ai │🔔│ │Profil│  │  ← Header 56px
│  └────┘              └───┘ └──────┘  │
├──────────────────────────────────────┤
│                                      │
│  Bonjour, Jean                     │  ← H2, Cream
│  ┌────────────────────────────────┐ │
│  │ 🌿 3 cultures suivies          │ │  ← Card stat
│  │ ┌──────┐ ┌──────┐ ┌──────┐    │ │
│  │ │ 12   │ │  8   │ │  5   │    │ │
│  │ │blé    │ │ maïs  │ │ soja  │    │ │
│  │ └──────┘ └──────┘ └──────┘    │ │
│  └────────────────────────────────┘ │
│                                      │
│  Alerte récente                   │  ← H3, Cream 80%
│  ┌────────────────────────────────┐ │
│  │ ⚠️  Rouille du blé détectée   │ │  ← Card alerte warning
│  │    Parcelle Nord · Il y a 2h   │ │
│  └────────────────────────────────┘ │
│                                      │
│  Derniers diagnostics             │  ← H3
│  ┌────────────────────────────────┐ │
│  │ ✓ Parcelle Sud — Sain         │ │  ← Card glass, badge success
│  │ ⚠ Parcelle Est — Mildiou      │ │  ← Card glass, badge warning
│  │ ✓ Parcelle Ouest — Sain       │ │  ← Card glass, badge success
│  └────────────────────────────────┘ │
│                                      │
│  ┌──────────────────────────────┐   │
│  │     🔍 Nouveau diagnostic    │   │  ← Button Primary lg (sticky CTA)
│  └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│  🏠    🔍    📋    📊    👤        │  ← Tab bar 64px
│ Accueil Scan  Histo  Stats Profil   │
└──────────────────────────────────────┘
```

**Structure layout :**
- Header (sticky, 56px) : Logo + titre + notifications + avatar
- ScrollView vertical
- Section "Bonjour" + résumé stats
- Section alerte récente
- Section derniers diagnostics (liste scrollable si >3)
- Bouton CTA flottant en bas (au-dessus de la tab bar)
- Tab bar (fixed bottom, 64px)

**Palette appliquée :**
- Fond écran : Black `#050D07`
- Header : Forest Green `#0A1B0E`, blur 12px
- Cartes : Slate `#2D3A2F` (glass)
- Titres : Cream
- Stats : JetBrains Mono, Lime
- Badge succès : Success `#3AE086`
- Badge warning : Warning `#FFB443`
- Icône notification active : Lime `#D4FF50`

**Points d'attention UX :**
- Le scroll ne doit pas cacher le bouton CTA (sticky en bas)
- Les cartes de diagnostic sont cliquables → mènent au résultat détaillé
- La notification (cloche) affiche un badge avec le nombre d'alertes non lues
- Le nom de l'agriculteur est récupéré du profil
- Pull-to-refresh pour actualiser les données
- Empty state : si aucun diagnostic, afficher illustration + "Lancez votre premier diagnostic"

---

### 9.4 Chat Diagnostic

```
┌──────────────────────────────────────┐
│  ←  Nouveau diagnostic            │  ← Header 56px, back button
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🤖 Bonjour ! Je suis votre    │ │  ← Bulle IA (gauche)
│  │ assistant de diagnostic.       │ │     Slate background
│  │                                │ │
│  │ Pour commencer, prenez une    │ │
│  │ photo de la plante concernée  │ │
│  │ ou décrivez les symptômes.    │ │
│  └────────────────────────────────┘ │
│                                      │
│          ┌──────────────────────────┐│
│          │ Les feuilles ont des     ││  ← Bulle utilisateur (droite)
│          │ taches jaunes            ││     Lime 10% background
│          └──────────────────────────┘│
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🤖 Je vois. Pouvez-vous       │ │  ← Bulle IA
│  │ préciser :                     │ │
│  │                                │ │
│  │ • La culture concernée ?      │ │
│  │ • Depuis combien de temps ?   │ │
│  │ • La météo récente ?          │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐        │  ← Quick replies
│  │ Blé  │ │ Maïs │ │ Soja │        │     style: tag, Lime outline
│  └──────┘ └──────┘ └──────┘        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ ● ● ●                          │ │  ← Typing indicator
│  └────────────────────────────────┘ │
│                                      │
├──────────────────────────────────────┤
│ ┌──────────┐ ┌────┐ ┌────┐ ┌────┐  │  ← Input bar 52px
│ │  Message  │ │ 📎 │ │ 🎤 │ │ ➤  │  │
│ └──────────┘ └────┘ └────┘ └────┘  │
└──────────────────────────────────────┘
```

**Structure layout :**
- Header (56px) : Back button + titre "Nouveau diagnostic"
- Chat scrollView (messages + quick replies + typing)
- Input bar (fixed bottom, 52px) : Input text + attach + mic + send
- Le clavier pousse l'input bar vers le haut

**Composants chatbot :**
- Bulle IA : fond Slate `#2D3A2F`, radius 12px 12px 12px 4px, align left
- Bulle utilisateur : fond `rgba(212,255,80,0.10)`, radius 12px 12px 4px 12px, align right
- Quick replies : boutons Ghost, Lime, taille sm, en ligne horizontale scrollable
- Typing indicator : 3 dots animés dans une bulle IA miniature
- Input : fond Slate `#2D3A2F`, radius 9999px (full pill)

**Points d'attention UX :**
- Le chat scroll automatiquement vers le bas à chaque nouveau message
- Les quick replies disparaissent après sélection
- Le bouton micro active la saisie vocale (accessibilité)
- Le bouton pièce jointe ouvre le sélecteur de photos
- Les liens dans les messages IA sont en Lime, soulignés
- Les messages de plus de 48h affichent un séparateur de date
- Scroll-to-bottom button si l'utilisateur remonte dans l'historique

---

### 9.5 Résultat Diagnostic

```
┌──────────────────────────────────────┐
│  ←  Résultat                      │  ← Header
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  │   [Photo de la plante]         │ │  ← Photo maladie, radius-lg
│  │   Avec overlay scanlines      │ │
│  │   + zones affectées           │ │     overlay scanlines + bounding boxes
│  │   entourées en Lime           │ │
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  ⚠️  Maladie détectée              │  ← Overline, Error, uppercase
│                                      │
│  Rouille jaune                    │  ← Display L
│  du blé                             │     Plus Jakarta Sans 800, Cream
│                                      │
│  ┌───┐ ┌───┐ ┌───┐                │  ← Tags
│  │🌾 │ │⚠️ │ │📅 │                │     tag-maladie, tag-culture
│  │Blé │ │75%│ │2j │                │
│  └───┘ └───┘ └───┘                │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📊 Niveau de confiance        │ │  ← Card stat
│  │                                │ │
│  │ ████████████████░░░░  92%     │ │  ← Progress bar Lime
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📋 Recommandations            │ │  ← Card diagnostic
│  │                                │ │
│  │ 1. Appliquer fongicide X      │ │
│  │    dans les 48h               │ │
│  │                                │ │
│  │ 2. Surveiller les parcelles   │ │
│  │    adjacentes                 │ │
│  │                                │ │
│  │ 3. Contacter un agronome si   │ │
│  │    plus de 30% de surface     │ │
│  │    touchée                    │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌──────────┐ ┌──────────────────┐  │
│  │ Partager │ │ Voir l'historique│  │  ← Secondary + Ghost
│  └──────────┘ └──────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│  🏠    🔍    📋    📊    👤        │  ← Tab bar
└──────────────────────────────────────┘
```

**Structure layout :**
- Header (56px) : Back button + titre "Résultat"
- ScrollView vertical
- Photo avec overlay scanlines + bounding boxes
- Titre maladie (Display L)
- Tags culture / sévérité / ancienneté
- Card confiance IA (progress bar)
- Card recommandations (liste numérotée)
- Boutons d'action

**Palette appliquée :**
- Fond écran : Black `#050D07`
- Photo : border Lime 20%, radius-lg
- Bounding boxes : Lime `#D4FF50`, stroke-dasharray, animées
- Badge sévérité 75% : Warning `#FFB443` (modéré) ou Error `#FF4E5C` (critique)
- Progress bar : fond Slate, fill Lime
- Card recommandations : border Lime 12%, glow-subtle

**Points d'attention UX :**
- La sévérité détermine la couleur dominante de l'écran (Lime = bénin, Warning = modéré, Error = critique)
- Le bouton "Partager" génère un résumé PDF/texte à envoyer (WhatsApp, email, etc.)
- Les recommandations sont numérotées par priorité
- La confiance IA < 70% affiche un avertissement : "Faites vérifier par un expert"
- Scroll vers le bas pour voir la section "Traitements similaires" ou "Prévention"
- La photo peut être agrandie en plein écran au tap

---

## 10. Annexes — Variables CSS

### 10.1 Design Tokens complet

```css
/* ══════════════════════════════════════════════════
   AGRISCAN.AI — DESIGN TOKENS v1.0
   Direction : SYNAPSE — Dark Tech Cinématique × Nature
   ══════════════════════════════════════════════════ */

:root {
  /* ── Couleurs Principales ── */
  --color-black: #050D07;
  --color-forest-green: #0A1B0E;
  --color-cream: #F9F9F2;
  --color-lime: #D4FF50;
  --color-slate: #2D3A2F;

  /* ── Couleurs Sémantiques ── */
  --color-success: #3AE086;
  --color-error: #FF4E5C;
  --color-warning: #FFB443;
  --color-info: #4DAAFF;

  /* ── Surfaces ── */
  --surface-primary: #050D07;
  --surface-secondary: #0A1B0E;
  --surface-elevated: #0E1F12;
  --surface-input: #2D3A2F;
  --surface-chat-user: rgba(212, 255, 80, 0.10);
  --surface-chat-ai: #2D3A2F;
  --surface-alert-error: rgba(255, 78, 92, 0.08);
  --surface-alert-warning: rgba(255, 180, 67, 0.08);
  --surface-alert-success: rgba(58, 224, 134, 0.08);
  --overlay-modal: rgba(5, 13, 7, 0.80);

  /* ── Textes ── */
  --text-primary: #F9F9F2;
  --text-secondary: rgba(249, 249, 242, 0.60);
  --text-tertiary: rgba(249, 249, 242, 0.40);
  --text-disabled: rgba(249, 249, 242, 0.20);
  --text-accent: #D4FF50;
  --text-error: #FF4E5C;
  --text-success: #3AE086;
  --text-warning: #FFB443;
  --text-info: #4DAAFF;

  /* ── Bordures ── */
  --border-default: 1px solid rgba(249, 249, 242, 0.08);
  --border-emphasis: 1px solid rgba(212, 255, 80, 0.20);
  --border-input: 1px solid rgba(249, 249, 242, 0.12);
  --border-input-focus: 1px solid rgba(212, 255, 80, 0.50);
  --border-error: 1px solid rgba(255, 78, 92, 0.50);
  --divider: 1px solid rgba(249, 249, 242, 0.06);
  --divider-strong: 1px solid rgba(249, 249, 242, 0.10);

  /* ── Border Radius ── */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-squircle: 28px;
  --radius-full: 9999px;

  /* ── Espacement ── */
  --space-0: 0;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;

  /* ── Ombres ── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.40);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.50);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.60);
  --glow-subtle: 0 0 10px rgba(212, 255, 80, 0.10);
  --glow-medium: 0 0 20px rgba(212, 255, 80, 0.15);
  --glow-intense: 0 0 40px rgba(212, 255, 80, 0.25);
  --glow-error: 0 0 20px rgba(255, 78, 92, 0.20);
  --glow-success: 0 0 20px rgba(58, 224, 134, 0.20);

  /* ── Typographie — Font Families ── */
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ── Typographie — Tailles Mobile ── */
  --text-display-xl: 3rem;      /* 48px */
  --text-display-l: 2.25rem;    /* 36px */
  --text-h1: 1.75rem;           /* 28px */
  --text-h2: 1.375rem;          /* 22px */
  --text-h3: 1.125rem;          /* 18px */
  --text-h4: 1rem;              /* 16px */
  --text-body-large: 1.0625rem; /* 17px */
  --text-body: 0.9375rem;       /* 15px */
  --text-body-small: 0.8125rem; /* 13px */
  --text-caption: 0.75rem;      /* 12px */
  --text-label: 0.6875rem;      /* 11px */
  --text-overline: 0.625rem;    /* 10px */
  --text-data-display: 2rem;    /* 32px */
  --text-data-body: 1rem;       /* 16px */
  --text-code-inline: 0.8125rem;/* 13px */

  /* ── Typographie — Line Heights ── */
  --leading-display-xl: 1.0;
  --leading-display-l: 1.1;
  --leading-h1: 1.2;
  --leading-h2: 1.3;
  --leading-h3: 1.35;
  --leading-h4: 1.4;
  --leading-body: 1.5;
  --leading-body-small: 1.45;
  --leading-caption: 1.4;
  --leading-label: 1.3;

  /* ── Animations ── */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Z-Index ── */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-max: 999;

  /* ── Glassmorphism ── */
  --glass-bg: rgba(10, 27, 14, 0.55);
  --glass-blur: blur(16px);
  --glass-border: 1px solid rgba(249, 249, 242, 0.06);
}
```

### 10.2 Classes utilitaires

```css
/* ── Typographie ── */

.display-xl {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-display-xl);
  line-height: var(--leading-display-xl);
  letter-spacing: -0.02em;
}

.display-l {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-display-l);
  line-height: var(--leading-display-l);
  letter-spacing: -0.015em;
}

.h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-h1);
  line-height: var(--leading-h1);
  letter-spacing: -0.01em;
}

.h2 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-h2);
  line-height: var(--leading-h2);
  letter-spacing: -0.005em;
}

.h3 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-h3);
  line-height: var(--leading-h3);
}

.h4 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-h4);
  line-height: var(--leading-h4);
}

.body-large {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body-large);
  line-height: var(--leading-body);
}

.body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--leading-body);
}

.body-small {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body-small);
  line-height: var(--leading-body-small);
}

.caption {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-caption);
  line-height: var(--leading-caption);
  letter-spacing: 0.02em;
}

.label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-label);
  line-height: var(--leading-label);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.overline {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-overline);
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.data-display {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-data-display);
  line-height: 1.2;
}

.data-body {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--text-data-body);
  line-height: var(--leading-body);
}

.code-inline {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--text-code-inline);
  line-height: 1.4;
}


/* ── Couleurs de texte ── */

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-disabled { color: var(--text-disabled); }
.text-accent { color: var(--text-accent); }
.text-error { color: var(--text-error); }
.text-success { color: var(--text-success); }
.text-warning { color: var(--text-warning); }
.text-info { color: var(--text-info); }


/* ── Surfaces ── */

.bg-primary { background: var(--surface-primary); }
.bg-secondary { background: var(--surface-secondary); }
.bg-elevated { background: var(--surface-elevated); }
.bg-input { background: var(--surface-input); }


/* ── Glass ── */

.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
}

.glass-heavy {
  background: rgba(10, 27, 14, 0.70);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 249, 242, 0.06);
}


/* ── Card ── */

.card {
  background: linear-gradient(135deg, rgba(10,27,14,0.60), rgba(45,58,47,0.40));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(249, 249, 242, 0.06);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.card-diagnostic {
  background: linear-gradient(135deg, rgba(10,27,14,0.80), rgba(45,58,47,0.50));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 255, 80, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--glow-subtle);
}


/* ── Boutons ── */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.btn:active {
  transform: scale(0.97);
  transition: transform var(--duration-fast) var(--ease-spring);
}

.btn:focus-visible {
  outline: 2px solid rgba(212, 255, 80, 0.50);
  outline-offset: 2px;
}

.btn-sm { height: 32px; padding: 0 12px; font-size: var(--text-label); }
.btn-md { height: 44px; padding: 0 20px; font-size: var(--text-body-small); }
.btn-lg { height: 52px; padding: 0 28px; font-size: var(--text-body); }

.btn-primary {
  background: var(--color-lime);
  color: var(--color-black);
  box-shadow: var(--glow-subtle);
}

.btn-primary:hover {
  background: #C5F030;
  box-shadow: var(--glow-medium);
}

.btn-primary:disabled {
  background: rgba(212, 255, 80, 0.15);
  color: rgba(5, 13, 7, 0.30);
  box-shadow: none;
  pointer-events: none;
}

.btn-secondary {
  background: transparent;
  color: var(--color-lime);
  border: 1px solid rgba(212, 255, 80, 0.40);
}

.btn-secondary:hover {
  background: rgba(212, 255, 80, 0.08);
  border-color: rgba(212, 255, 80, 0.60);
}

.btn-secondary:disabled {
  color: rgba(212, 255, 80, 0.15);
  border-color: rgba(212, 255, 80, 0.08);
  pointer-events: none;
}

.btn-ghost {
  background: transparent;
  color: var(--color-lime);
}

.btn-ghost:hover {
  background: rgba(212, 255, 80, 0.08);
}

.btn-ghost:disabled {
  color: rgba(212, 255, 80, 0.15);
  pointer-events: none;
}

.btn-danger {
  background: var(--color-error);
  color: var(--color-cream);
}

.btn-danger:hover {
  background: #E64450;
  box-shadow: var(--glow-error);
}

.btn-icon {
  padding: 0;
  width: 44px;
}


/* ── Inputs ── */

.input {
  background: var(--surface-input);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--leading-body);
  border: 1px solid rgba(249, 249, 242, 0.12);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  height: 44px;
  transition: border-color var(--duration-fast) var(--ease-out);
  caret-color: var(--color-lime);
}

.input::placeholder {
  color: rgba(249, 249, 242, 0.30);
}

.input:focus {
  border-color: rgba(212, 255, 80, 0.50);
  outline: none;
  box-shadow: 0 0 0 2px rgba(212, 255, 80, 0.10);
}

.input-error {
  border-color: rgba(255, 78, 92, 0.50);
  box-shadow: 0 0 0 2px rgba(255, 78, 92, 0.08);
}

.input-error:focus {
  border-color: rgba(255, 78, 92, 0.50);
  box-shadow: 0 0 0 2px rgba(255, 78, 92, 0.08);
}

.input-success {
  border-color: rgba(58, 224, 134, 0.50);
  box-shadow: 0 0 0 2px rgba(58, 224, 134, 0.08);
}

.input:disabled {
  background: rgba(45, 58, 47, 0.30);
  color: var(--text-disabled);
  border-color: transparent;
  pointer-events: none;
}


/* ── Badges ── */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.badge-success { background: rgba(58,224,134,0.12); color: var(--color-success); }
.badge-error { background: rgba(255,78,92,0.12); color: var(--color-error); }
.badge-warning { background: rgba(255,180,67,0.12); color: var(--color-warning); }
.badge-info { background: rgba(77,170,255,0.12); color: var(--color-info); }


/* ── Tags ── */

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.tag-maladie {
  background: rgba(255,78,92,0.10);
  color: var(--color-error);
  border: 1px solid rgba(255,78,92,0.25);
}

.tag-culture {
  background: rgba(58,224,134,0.10);
  color: var(--color-success);
  border: 1px solid rgba(58,224,134,0.25);
}


/* ── Effets ── */

.glow-subtle { box-shadow: var(--glow-subtle); }
.glow-medium { box-shadow: var(--glow-medium); }
.glow-intense { box-shadow: var(--glow-intense); }

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 998;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1' /%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  z-index: 1;
}


/* ── Layout ── */

.screen {
  min-height: 100dvh;
  background: var(--surface-primary);
  color: var(--text-primary);
}

.header {
  position: sticky;
  top: 0;
  height: 56px;
  background: rgba(5, 13, 7, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(249, 249, 242, 0.06);
  display: flex;
  align-items: center;
  padding: 0 var(--space-lg);
  z-index: var(--z-sticky);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(10, 27, 14, 0.90);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(249, 249, 242, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: var(--z-sticky);
}

.safe-area {
  padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
}
```

---

### 10.3 Sources & Références

| Standard | Usage dans ce document |
|----------|----------------------|
| **WCAG 2.1** | Ratios de contraste, accessibilité couleur |
| **Material Design 3** | Système de tokens (espacement, radius, elevation) |
| **Apple HIG** | Grilles mobile, tailles tactiles (44px minimum), safe areas |
| **Lucide Icons** | Librairie d'icônes principale |
| **Google Fonts** | Distribution des polices |
| **OKLCH Colorspace** | Espace colorimétrique pour les calculs de teinte/chroma |

---

> **Document établi par l'équipe design AgriScan.ai — Mai 2026**
> Projet Bachelor · Chambre d'Agriculture
> Toute reproduction ou modification doit respecter les termes de cette charte.
