#!/usr/bin/env python3
"""Generate AgriScan AI project report as DOCX."""

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
import os

# === Paths ===
BASE_DIR = "/home/mattia/Projet-d-etude"
ASSETS_DIR = os.path.join(BASE_DIR, "POWERPOINT", "assets")
OUTPUT_PATH = os.path.join(BASE_DIR, "Rapport_AgriScan_AI.docx")

# === Settings ===
LOGO_TEXT = "AgriScan AI"
DOC_TITLE = "Rapport de Projet d'Étude"
SUBTITLE = "Bachelor 1 — 2025/2026"
AUTHOR_1 = "[NOM ÉTUDIANT 1]"
AUTHOR_2 = "[NOM ÉTUDIANT 2]"
AUTHOR_3 = "[NOM ÉTUDIANT 3]"
SCHOOL = "[NOM DE L'ÉTABLISSEMENT]"
SUPERVISOR = "[NOM DE L'ENCADRANT]"

doc = Document()

# === Page setup ===
for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

# === Styles ===
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)
style.paragraph_format.space_after = Pt(6)
style.paragraph_format.line_spacing = 1.15

for level in range(1, 4):
    heading_style = doc.styles[f'Heading {level}']
    heading_style.font.color.rgb = RGBColor(0x1B, 0x5E, 0x20)

def add_page_break():
    doc.add_page_break()

def add_heading(text, level=1):
    return doc.add_heading(text, level=level)

def add_para(text, bold=False, italic=False, align=None, font_size=None):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    if font_size:
        run.font.size = Pt(font_size)
    if align is not None:
        p.alignment = align
    return p

def add_image(img_name, width_inches=5.0):
    img_path = os.path.join(ASSETS_DIR, img_name)
    if os.path.exists(img_path):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run()
        run.add_picture(img_path, width=Inches(width_inches))
    else:
        add_para(f"[Image non trouvée : {img_name}]", italic=True)

def add_caption(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.italic = True
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

# ===================================================================
# PAGE DE GARDE
# ===================================================================

for _ in range(6):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run(LOGO_TEXT)
run.bold = True
run.font.size = Pt(36)
run.font.color.rgb = RGBColor(0x1B, 0x5E, 0x20)

doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run(DOC_TITLE)
run.font.size = Pt(22)

doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run(SUBTITLE)
run.font.size = Pt(16)
run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

for _ in range(5):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run(f"{AUTHOR_1}\n{AUTHOR_2}\n{AUTHOR_3}")
run.font.size = Pt(13)

doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run(f"Établissement : {SCHOOL}\nEncadrant : {SUPERVISOR}")
run.font.size = Pt(11)
run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Mai 2026")
run.font.size = Pt(12)

add_page_break()

# ===================================================================
# REMERCIEMENTS
# ===================================================================

add_heading("Remerciements", level=1)

add_para(
    "Nous tenons à exprimer notre sincère gratitude envers toutes les personnes "
    "qui ont contribué à la réalisation de ce projet d'étude."
)

add_para(
    "En premier lieu, nous remercions la Chambre d'Agriculture pour avoir formulé "
    "le cahier des charges qui a servi de fondement à notre travail. Leur confiance "
    "dans notre capacité à répondre aux enjeux du monde agricole par l'innovation "
    "technologique a été un puissant moteur tout au long du projet."
)

add_para(
    f"Nous adressons également nos plus vifs remerciements à {SUPERVISOR}, notre "
    f"encadrant, pour ses conseils avisés, sa disponibilité et son accompagnement "
    f"tout au long de cette année. Ses retours réguliers nous ont permis d'affiner "
    f"notre approche et de maintenir un haut niveau d'exigence."
)

add_para(
    f"Enfin, nous remercions l'ensemble de l'équipe pédagogique de {SCHOOL} "
    f"pour les enseignements théoriques et pratiques dispensés durant cette première "
    f"année de Bachelor, qui nous ont fourni les outils nécessaires à la conduite de ce projet."
)

add_page_break()

# ===================================================================
# RÉSUMÉ
# ===================================================================

add_heading("Résumé", level=1)

add_para(
    "AgriScan AI est une application mobile et web de diagnostic intelligent "
    "des maladies des plantes, développée dans le cadre du projet d'étude de "
    "Bachelor 1 (2025-2026), en réponse à une demande de la Chambre d'Agriculture. "
    "L'application permet à un agriculteur de photographier une plante suspecte "
    "et d'obtenir en moins de cinq secondes un diagnostic complet — maladie identifiée, "
    "probabilité, niveau d'urgence et traitement recommandé — grâce à un agent "
    "d'intelligence artificielle spécialisé en pathologie végétale."
)

add_para(
    "Le projet s'articule autour de cinq modules principaux : le diagnostic par IA, "
    "un assistant conversationnel, un tableau de bord avec historique, des alertes "
    "phytosanitaires géolocalisées sur carte interactive, et un espace de gestion "
    "de profil. L'architecture technique repose sur un frontend React Native / Expo "
    "multi-plateforme (iOS, Android, Web), un backend Python FastAPI connecté à une "
    "base MongoDB, et un moteur d'inférence IA propulsé par Llama 70B via Groq."
)

add_para(
    "Initialement développé sur la plateforme no-code Emergent, le projet a connu "
    "une migration stratégique vers une architecture locale autonome, garantissant "
    "une indépendance technique et financière totale. Le rapport présente l'ensemble "
    "du processus de conception, de développement et de déploiement, ainsi que les "
    "perspectives d'évolution de la solution."
)

add_page_break()

# ===================================================================
# INTRODUCTION
# ===================================================================

add_heading("Introduction", level=1)

add_para(
    "Le secteur agricole fait face à des défis sans précédent : changement climatique, "
    "pression démographique, raréfaction des ressources et exigences croissantes en "
    "matière de durabilité. Dans ce contexte, la détection précoce des maladies des "
    "plantes constitue un enjeu majeur. Aujourd'hui, un agriculteur confronté à une "
    "plante malade dans son champ ne peut pas toujours joindre un agronome rapidement. "
    "Le délai moyen d'obtention d'un diagnostic est de quarante-huit à soixante-douze "
    "heures — un laps de temps critique pendant lequel une maladie peut se propager "
    "à l'ensemble d'une parcelle."
)

add_para(
    "Les conséquences sont lourdes : un traitement tardif peut entraîner jusqu'à "
    "quarante pour cent de perte de récolte, un préjudice économique souvent "
    "irréversible pour la saison. Par ailleurs, les alertes phytosanitaires — "
    "informations pourtant cruciales pour anticiper les risques — restent dispersées "
    "entre différentes sources, sans visualisation géolocalisée centralisée. "
    "L'agriculteur ne dispose pas d'une vue d'ensemble des menaces qui pèsent "
    "sur ses parcelles."
)

add_para(
    "C'est pour répondre à cette problématique que la Chambre d'Agriculture a "
    "formulé un cahier des charges visant à concevoir une application mobile "
    "intégrant l'intelligence artificielle pour le diagnostic des cultures. "
    "Ce projet d'étude s'inscrit dans la thématique « IA & Agriculture » et "
    "vise à explorer comment les technologies d'intelligence artificielle "
    "peuvent répondre aux enjeux agricoles contemporains."
)

add_para(
    "Ce rapport présente l'ensemble de la démarche suivie : de l'analyse du besoin "
    "à la réalisation du prototype fonctionnel, en passant par les choix "
    "architecturaux, les défis techniques surmontés et les perspectives d'évolution "
    "de la solution AgriScan AI."
)

add_page_break()

# ===================================================================
# CAHIER DES CHARGES
# ===================================================================

add_heading("Cahier des charges", level=1)

add_heading("Objectifs pédagogiques", level=2)
add_para(
    "Le projet d'étude du Bachelor 1 poursuit plusieurs objectifs pédagogiques : "
    "développer une compréhension approfondie d'une problématique entrepreneuriale "
    "réelle, initier les étudiants à la démarche de projet technique en lien avec "
    "une problématique sociétale, intégrer une veille technologique, et exploiter "
    "les acquis théoriques des cours techniques (No-code/Low-code, développement "
    "informatique, IA, cloud, réseau, prototypage)."
)

add_heading("Thématique : IA & Agriculture", level=2)
add_para(
    "La thématique centrale du projet est l'application de l'intelligence "
    "artificielle au secteur agricole. Les étudiants sont invités à explorer "
    "les usages de l'IA pour répondre aux problématiques de rendement, de "
    "surveillance des cultures, de gestion des ressources ou de préservation "
    "de la biodiversité. Parmi les cas d'usage suggérés figurent la détection "
    "de maladies des plantes par vision par ordinateur, la prédiction des "
    "rendements agricoles à partir de données météo et de sol, ou encore la "
    "surveillance des élevages avec capteurs et IA."
)

add_heading("Demande de la Chambre d'Agriculture", level=2)
add_para(
    "Dans le cadre d'une demande formulée par la Chambre d'Agriculture, les "
    "étudiants doivent concevoir une application mobile fonctionnelle, développée "
    "avec un outil no-code/low-code, répondant à une problématique agricole "
    "concrète. L'application doit intégrer une logique d'intelligence artificielle "
    "et s'appuyer sur une architecture cloud et réseau simplifiée."
)

add_heading("Exigences fonctionnelles", level=2)
add_para(
    "Le cahier des charges définit les modules attendus suivants :"
)

expected_modules = [
    ("Page d'accueil", "Présentation du projet, accès rapide aux modules, actualités agricoles"),
    ("Module de diagnostic IA", "Formulaire de saisie, traitement par IA, affichage du résultat"),
    ("Carte interactive", "Localisation des parcelles, visualisation des données par zone"),
    ("Tableau de bord", "Vue synthétique des données, historique des diagnostics, alertes"),
    ("Espace communautaire (optionnel)", "Forum ou messagerie entre agriculteurs"),
    ("Administration", "Gestion des utilisateurs, données et modèles IA, statistiques"),
    ("Gestion de compte", "Inscription, connexion, profil utilisateur"),
]

for mod_name, mod_desc in expected_modules:
    p = doc.add_paragraph()
    run = p.add_run(f"{mod_name} : ")
    run.bold = True
    p.add_run(mod_desc)

add_heading("Contraintes techniques", level=2)
add_para(
    "Le cahier des charges impose l'utilisation d'un outil no-code/low-code. "
    "L'intelligence artificielle peut être simulée ou appelée via une API externe. "
    "L'application doit être testable sur mobile avec une interface responsive. "
    "Un déploiement sur une plateforme cloud est recommandé en option. Enfin, "
    "l'architecture doit intégrer des capteurs IoT, simulés ou réels."
)

add_page_break()

# ===================================================================
# ÉTAT DE L'ART
# ===================================================================

add_heading("État de l'art", level=1)

add_para(
    "Avant de concevoir notre solution, nous avons analysé les applications "
    "existantes dans le domaine de l'agriculture numérique et du diagnostic "
    "végétal assisté par IA. Cette analyse nous a permis d'identifier les forces "
    "et les limites des solutions actuellement disponibles sur le marché."
)

add_heading("Plantix", level=2)
add_para(
    "Plantix est l'application de référence en matière de diagnostic de maladies "
    "des plantes par photographie. Développée par PEAT GmbH, elle utilise la "
    "reconnaissance d'images par deep learning pour identifier les maladies à "
    "partir d'une photo prise par l'agriculteur. L'application couvre une large "
    "gamme de cultures et propose des recommandations de traitement."
)
add_para(
    "Forces : base de données exhaustive, communauté d'utilisateurs active, "
    "disponible dans de nombreuses langues. Limites : l'analyse est purement "
    "visuelle sans dialogue possible pour affiner le diagnostic, pas de "
    "géolocalisation avancée des alertes, interface parfois complexe pour "
    "les non-initiés."
)

add_heading("FarmLogs", level=2)
add_para(
    "FarmLogs (devenue Bushel Farm) est une plateforme de gestion agricole "
    "axée sur le suivi des parcelles et la prévision des rendements. Elle "
    "exploite des données météorologiques, des images satellites et des "
    "données de sol pour fournir des indicateurs de performance aux exploitants."
)
add_para(
    "Forces : visualisation cartographique avancée, suivi précis des parcelles, "
    "analyse de rentabilité. Limites : pas de diagnostic de maladies par IA "
    "conversationnelle, orientation vers les grandes exploitations céréalières "
    "américaines, pas d'alertes phytosanitaires temps réel."
)

add_heading("AgriApp", level=2)
add_para(
    "AgriApp est une solution mobile de suivi des cultures et d'alertes maladies "
    "qui combine des données de terrain avec des conseils agronomiques personnalisés. "
    "Elle cible particulièrement les petites et moyennes exploitations."
)
add_para(
    "Forces : interface simple et intuitive, alertes personnalisées, conseils "
    "adaptés au contexte local. Limites : couverture géographique limitée, "
    "pas d'intégration de capteurs IoT, IA limitée à des règles prédéfinies "
    "plutôt qu'un véritable modèle d'apprentissage."
)

add_heading("Positionnement d'AgriScan AI", level=2)
add_para(
    "AgriScan AI se positionne à la croisée de ces solutions en combinant : "
    "un diagnostic IA conversationnel (comme Plantix, mais avec la possibilité "
    "de dialoguer pour affiner le résultat), une carte interactive avec alertes "
    "géolocalisées (comme FarmLogs, mais orientée santé des cultures), et une "
    "interface simple pensée pour l'agriculteur (comme AgriApp). "
    "Notre différenciation principale réside dans l'usage d'un modèle de langage "
    "large (LLM) spécialisé, capable non seulement d'identifier une maladie mais "
    "aussi d'expliquer son raisonnement et de répondre aux questions de "
    "l'utilisateur en langage naturel."
)

add_page_break()

# ===================================================================
# SOLUTION PROPOSÉE
# ===================================================================

add_heading("Solution proposée : AgriScan AI", level=1)

add_para(
    "AgriScan AI repose sur un principe simple : une photo, une analyse, un "
    "traitement. L'utilisateur photographie une plante présentant des symptômes "
    "suspects, l'application transmet l'image à un agent IA spécialisé en "
    "pathologie végétale, et en moins de cinq secondes, un diagnostic complet "
    "est retourné."
)

add_para(
    "L'application s'articule autour de cinq modules fonctionnels principaux, "
    "accessibles depuis une barre de navigation par onglets :"
)

modules = [
    ("Diagnostic IA", "Le cœur de l'application. L'utilisateur décrit les symptômes "
     "observés et peut joindre une photo. L'IA analyse l'image et le texte pour "
     "identifier la maladie, estimer sa probabilité et proposer un traitement adapté. "
     "Un système de conversation permet d'affiner le diagnostic par échange avec l'agent."),
    ("Assistant conversationnel", "Un agent IA spécialisé avec lequel l'utilisateur "
     "peut dialoguer, dossier par dossier. Chaque diagnostic dispose de son propre "
     "historique de conversation, permettant un suivi contextuel précis."),
    ("Tableau de bord", "Vue d'ensemble de l'activité : nombre de diagnostics, "
     "répartition par statut (en cours, traité, surveillance), tendances et "
     "historique complet. L'agriculteur peut filtrer, trier et gérer l'ensemble "
     "de ses dossiers."),
    ("Alertes géolocalisées", "Carte interactive affichant les alertes phytosanitaires "
     "classées par type et par sévérité — critique, modérée ou information. Les alertes "
     "intègrent des données météo par zone et permettent une visualisation en un "
     "coup d'œil des menaces sur les parcelles."),
    ("Profil & Exploitation", "Gestion des informations personnelles, des paramètres "
     "de l'exploitation agricole, de la photo de profil et du mot de passe. "
     "Deux rôles sont disponibles : agriculteur et administrateur."),
]

for mod_name, mod_desc in modules:
    p = doc.add_paragraph()
    run = p.add_run(f"{mod_name} — ")
    run.bold = True
    p.add_run(mod_desc)

add_para(
    "L'interface utilisateur adopte le thème SYNAPSE, un design system sombre "
    "et premium aux accents verts naturels, conçu pour une utilisation confortable "
    "en extérieur, y compris en plein soleil. La typographie est soignée et les "
    "réponses de l'IA sont mises en forme en markdown pour une lisibilité optimale."
)

add_page_break()

# ===================================================================
# FONCTIONNALITÉS DÉTAILLÉES
# ===================================================================

add_heading("Fonctionnalités détaillées", level=1)

# --- Accueil ---
add_heading("Page d'accueil", level=2)
add_para(
    "La page d'accueil constitue le point d'entrée de l'application. Elle présente "
    "un résumé des statistiques de l'utilisateur — nombre total de diagnostics, "
    "alertes non lues — ainsi que la liste des diagnostics récents pour un accès "
    "rapide. Un bouton proéminent « Nouveau diagnostic » invite l'utilisateur à "
    "initier une analyse."
)
add_image("home_page.jpg", 4.5)
add_caption("Figure 1 — Page d'accueil d'AgriScan AI")

# --- Diagnostic IA ---
add_heading("Module de diagnostic IA", level=2)
add_para(
    "Le module de diagnostic constitue la fonctionnalité centrale d'AgriScan AI. "
    "L'utilisateur est d'abord invité à remplir un formulaire précisant la culture "
    "concernée (tomates, blé, vigne, etc.) et décrivant les symptômes observés. "
    "Il peut également joindre une photographie de la plante affectée."
)
add_para(
    "Une fois le diagnostic créé, l'interface bascule en mode conversationnel : "
    "une discussion s'engage avec l'agent IA. Celui-ci analyse la photo et la "
    "description pour formuler un diagnostic structuré comprenant le nom de la "
    "maladie, un pourcentage de probabilité, un niveau d'urgence et une "
    "recommandation de traitement. L'utilisateur peut poser des questions "
    "complémentaires pour affiner le diagnostic ou obtenir des précisions."
)
add_para(
    "Les réponses de l'IA sont mises en forme en markdown — titres, listes, texte "
    "en gras — avec une palette de couleurs vertes sur fond sombre, ce qui améliore "
    "considérablement la lisibilité des informations techniques. L'historique complet "
    "de la conversation est conservé et accessible à tout moment."
)
add_image("diag_page.jpg", 4.5)
add_caption("Figure 2 — Interface de diagnostic avec résultat de l'IA")

# --- Dashboard ---
add_heading("Tableau de bord et historique", level=2)
add_para(
    "Le tableau de bord offre une vue synthétique de l'activité de l'utilisateur. "
    "Il affiche les statistiques globales — nombre total de diagnostics, répartition "
    "par statut (en cours, traité, surveillance) — et permet de parcourir l'historique "
    "complet des diagnostics avec des filtres par statut."
)
add_para(
    "Chaque diagnostic peut être consulté en détail, son statut modifié, ou supprimé. "
    "Cette fonctionnalité permet à l'agriculteur de suivre l'évolution sanitaire de "
    "ses cultures dans le temps et de conserver une trace de chaque intervention."
)
add_image("dashboard_page.jpg", 4.5)
add_caption("Figure 3 — Tableau de bord avec historique des diagnostics")

# --- Alertes ---
add_heading("Alertes phytosanitaires géolocalisées", level=2)
add_para(
    "Le module d'alertes intègre une carte Google Maps interactive qui permet à "
    "l'agriculteur de visualiser ses parcelles et les alertes en cours. Chaque "
    "alerte est classée par type (maladie, météo, système) et par sévérité "
    "(critique, modérée, information), représentée par un code couleur distinctif."
)
add_para(
    "L'agriculteur peut voir d'un coup d'œil ce qui menace ses cultures avant "
    "même d'aller au champ. La carte affiche des marqueurs positionnés précisément "
    "aux coordonnées des alertes, avec des informations contextuelles comme la "
    "température, l'humidité et le niveau de risque. Un système de notification "
    "permet d'être alerté en temps réel des nouveaux risques détectés."
)
add_image("alert_page_map.jpg", 4.5)
add_caption("Figure 4 — Carte interactive des alertes géolocalisées")

# --- Profil ---
add_heading("Profil utilisateur", level=2)
add_para(
    "L'espace de profil permet à l'utilisateur de gérer ses informations "
    "personnelles : nom, adresse email, numéro de téléphone, nom de l'exploitation "
    "et localisation. Il peut également modifier sa photo de profil et changer "
    "son mot de passe. Le rôle de l'utilisateur — agriculteur ou administrateur — "
    "est affiché avec un badge distinctif."
)
add_image("profile_page.jpg", 4.0)
add_caption("Figure 5 — Page de profil utilisateur")

add_page_break()

# ===================================================================
# ARCHITECTURE TECHNIQUE
# ===================================================================

add_heading("Architecture technique", level=1)

add_para(
    "L'architecture d'AgriScan AI repose sur une structure en trois couches "
    "clairement séparées, suivant le modèle client-serveur classique enrichi "
    "d'une couche d'intelligence artificielle externe."
)

add_heading("Couche Client — Frontend", level=2)
add_para(
    "Le frontend est développé avec React Native via le framework Expo (SDK 54), "
    "permettant un déploiement simultané sur iOS, Android et Web à partir d'un "
    "code source unique. La navigation est assurée par Expo Router, un routeur "
    "basé sur le système de fichiers. La gestion d'état est confiée à Zustand, "
    "une bibliothèque légère et performante."
)
add_para(
    "Le design system SYNAPSE — une palette de verts forestiers, crème et tons "
    "anthracite — est appliqué de manière cohérente sur l'ensemble de l'interface. "
    "Les réponses de l'IA sont affichées en markdown via un composant de rendu "
    "dédié utilisant react-native-markdown-display. La carte interactive utilise "
    "react-native-maps sur mobile et l'API Google Maps JavaScript sur web."
)

add_heading("Couche Serveur — Backend", level=2)
add_para(
    "Le backend est une API REST développée en Python avec le framework FastAPI, "
    "servie par le serveur Uvicorn. Il expose une vingtaine de points d'accès "
    "(endpoints) organisés sous le préfixe /api. Les principales responsabilités "
    "du backend incluent l'authentification des utilisateurs, la gestion des "
    "diagnostics, l'historique des conversations, les alertes et les statistiques."
)
add_para(
    "Les données sont stockées dans une base MongoDB, accessible via le driver "
    "asynchrone Motor. Chaque conversation de diagnostic est isolée dans une "
    "collection MongoDB dédiée (messages_{id}), garantissant une séparation "
    "claire des contextes de discussion. Le schéma de données comprend quatre "
    "collections principales : users, diagnostics, alerts, et les collections "
    "de messages par diagnostic."
)

add_heading("Couche Intelligence Artificielle", level=2)
add_para(
    "La couche IA est assurée par le modèle Llama 70B de Meta, accessible via "
    "le service cloud Groq. Ce modèle de langage large (LLM) est spécialisé en "
    "pathologie végétale grâce à un system prompt détaillé qui lui confère une "
    "expertise agronomique. Pour l'analyse d'images, le modèle Llama 4 Scout 17B, "
    "doté de capacités de vision, prend le relais."
)
add_para(
    "L'architecture a connu une évolution majeure en cours de projet. Initialement "
    "développée sur la plateforme no-code Emergent (qui utilisait GPT-5.2), elle "
    "a été migrée vers une solution locale et indépendante utilisant FastAPI, "
    "MongoDB et les modèles Llama via Groq. Cette migration a garanti une autonomie "
    "technique et financière totale."
)

# Architecture overview table
add_heading("Vue d'ensemble de la stack technique", level=2)

table = doc.add_table(rows=5, cols=2)
table.style = 'Light Grid Accent 1'
table.alignment = WD_TABLE_ALIGNMENT.CENTER

data = [
    ("Frontend", "React 19, React Native 0.81, Expo SDK 54, Expo Router, TypeScript, Zustand"),
    ("Backend", "Python 3, FastAPI, Uvicorn, Motor (MongoDB async driver)"),
    ("Base de données", "MongoDB"),
    ("Intelligence Artificielle", "Llama 70B (texte) + Llama 4 Scout 17B (vision) via Groq"),
    ("Cartographie", "react-native-maps (mobile) / Google Maps JS API (web)"),
]

for i, (key, val) in enumerate(data):
    row = table.rows[i]
    row.cells[0].text = key
    row.cells[1].text = val
    for cell in row.cells:
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(10)
    # Bold for key column
    for paragraph in row.cells[0].paragraphs:
        for run in paragraph.runs:
            run.bold = True

add_page_break()

# ===================================================================
# DÉVELOPPEMENT & MÉTHODOLOGIE
# ===================================================================

add_heading("Développement et méthodologie", level=1)

add_heading("Approche No-Code / Low-Code", level=2)
add_para(
    "Conformément au cahier des charges, le projet a débuté sur la plateforme "
    "no-code Emergent. Cette plateforme a permis un prototypage rapide en "
    "fournissant de manière native l'infrastructure, la base de données, "
    "l'authentification et le stockage. Le time-to-market a ainsi été divisé "
    "par trois par rapport à un développement classique."
)
add_para(
    "À cette base no-code, nous avons superposé des agents d'intelligence "
    "artificielle spécialisés via la bibliothèque emergentintegrations : un "
    "system prompt expert en pathologie végétale, une mémoire de conversation "
    "par dossier diagnostic, et une capacité d'analyse multimodale combinant "
    "photo et texte."
)

add_heading("Le pivot stratégique : la migration", level=2)
add_para(
    "À mi-parcours du projet, nous avons été confrontés à un obstacle majeur : "
    "les crédits de la plateforme Emergent étaient épuisés. La facturation au "
    "volume de requêtes rendait le modèle économique intenable pour un usage "
    "prolongé. Ce qui aurait pu signer l'arrêt du projet s'est transformé en "
    "opportunité."
)
add_para(
    "Nous avons pris la décision d'exporter l'intégralité du code depuis la "
    "plateforme Emergent et de le faire fonctionner de manière indépendante. "
    "Cette migration s'est déroulée en trois étapes :"
)

migration_steps = [
    "Export du backend : récupération de l'ensemble du code généré par la plateforme.",
    "Adaptation locale : réécriture des dépendances pour fonctionner avec FastAPI "
    "comme serveur web, Motor comme driver MongoDB asynchrone, et remplacement de "
    "GPT-5.2 par les modèles Llama de Meta, accessibles gratuitement via le service "
    "cloud Groq.",
    "Validation : tests complets de l'API pour garantir que tous les endpoints "
    "conservaient leur comportement fonctionnel après la migration.",
]

for i, step in enumerate(migration_steps, 1):
    p = doc.add_paragraph()
    run = p.add_run(f"{i}. ")
    run.bold = True
    p.add_run(step)

add_para(
    "Le résultat de cette migration est une autonomie totale : nous maîtrisons "
    "désormais cent pour cent de notre stack technique, sans dépendance à une "
    "plateforme tierce, avec des coûts d'infrastructure maîtrisés et une "
    "roadmap d'évolution entièrement libre."
)

add_heading("Défis techniques surmontés", level=2)

add_para("Trois défis majeurs ont jalonné le développement :")

add_para(
    "Le cross-platform — faire fonctionner le même code sur iOS, Android et Web. "
    "La solution a reposé sur le framework Expo, avec une détection de la "
    "plateforme (Platform.OS), l'utilisation d'AsyncStorage côté web et de "
    "SecureStore côté natif, et deux implémentations distinctes de Google Maps. "
    "Résultat : un codebase unique pour trois plateformes."
)

add_para(
    "L'intégration de l'IA sans dégrader l'expérience utilisateur — les appels "
    "aux modèles de langage peuvent être lents. Nous avons implémenté le streaming "
    "des réponses pour éviter les temps de chargement bloquants, et le parsing "
    "automatique des réponses structurées pour extraire maladie, probabilité et "
    "traitement. Résultat : un diagnostic complet en moins de cinq secondes."
)

add_para(
    "La migration Emergent vers Groq/Llama — déjà décrite ci-dessus — a constitué "
    "le défi le plus critique du projet. La réussite de cette migration a démontré "
    "notre capacité d'adaptation et notre maîtrise technique face à une contrainte "
    "imprévue."
)

add_page_break()

# ===================================================================
# INTELLIGENCE ARTIFICIELLE
# ===================================================================

add_heading("Intelligence Artificielle", level=1)

add_heading("System prompt et spécialisation", level=2)
add_para(
    "Le cœur de l'intelligence d'AgriScan AI réside dans un system prompt "
    "soigneusement élaboré qui transforme un modèle de langage généraliste en "
    "un expert en pathologie végétale. Ce prompt définit le rôle, les connaissances "
    "et le comportement attendu de l'agent : identification de maladies à partir "
    "de descriptions textuelles et de photographies, estimation de probabilité, "
    "recommandations de traitement biologiques et chimiques, conseils de prévention, "
    "et évaluation du niveau d'urgence."
)
add_para(
    "L'agent est conçu pour fournir des réponses structurées en français, "
    "adaptées au contexte agricole. Chaque réponse contenant un diagnostic "
    "formel met automatiquement à jour le dossier avec le nom de la maladie, "
    "la probabilité estimée et le traitement recommandé."
)

add_heading("Analyse multimodale photo + texte", level=2)
add_para(
    "Une des fonctionnalités clés est l'analyse multimodale : l'utilisateur peut "
    "joindre une photographie à sa description textuelle. L'image est encodée en "
    "base64 et transmise au modèle de vision (Llama 4 Scout 17B) qui l'analyse "
    "conjointement avec le texte pour produire un diagnostic plus précis. "
    "L'image est conservée dans la base de données pour référence ultérieure "
    "et réaffichage dans l'historique de conversation."
)

add_heading("Évolution du modèle IA", level=2)

# Comparison table
table2 = doc.add_table(rows=4, cols=3)
table2.style = 'Light Grid Accent 1'
table2.alignment = WD_TABLE_ALIGNMENT.CENTER

comp_data = [
    ("Critère", "GPT-5.2 (Emergent)", "Llama 70B (Groq)"),
    ("Type de modèle", "Propriétaire (OpenAI)", "Open source (Meta)"),
    ("Coût", "Payant (crédits limités)", "Gratuit"),
    ("Indépendance", "Dépendance à la plateforme Emergent", "Autonomie totale"),
]

for i, (c1, c2, c3) in enumerate(comp_data):
    row = table2.rows[i]
    row.cells[0].text = c1
    row.cells[1].text = c2
    row.cells[2].text = c3
    for cell in row.cells:
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(10)
    if i == 0:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.bold = True

add_para("")
add_para(
    "Le passage à Llama 70B via Groq a apporté plusieurs avantages décisifs : "
    "un coût d'API nul, une indépendance totale vis-à-vis des plateformes "
    "propriétaires, et la possibilité d'utiliser un modèle de vision distinct "
    "(Llama 4 Scout 17B) pour l'analyse d'images, optimisant ainsi chaque tâche "
    "avec le modèle le plus adapté."
)

add_page_break()

# ===================================================================
# CAPTEURS IoT
# ===================================================================

add_heading("Infrastructure IoT", level=1)

add_para(
    "Dans une optique d'agriculture de précision, AgriScan AI intègre une "
    "architecture de capteurs IoT conçue pour remonter en temps réel les données "
    "du terrain. Bien que simulée côté frontend dans la version actuelle, "
    "l'infrastructure est architecturée pour un déploiement physique."
)

add_para(
    "Six indicateurs sont suivis : température ambiante, humidité du sol, "
    "lumière PAR (rayonnement photosynthétiquement actif), vitesse du vent, "
    "pH du sol et niveau de batterie des capteurs. La connectivité repose sur "
    "le protocole LoRaWAN (Long Range Wide Area Network), particulièrement "
    "adapté aux environnements agricoles étendus où la couverture cellulaire "
    "peut être limitée."
)

add_para(
    "Les données sont simulées avec une transmission configurée toutes les "
    "trois minutes et un signal de qualité quatre sur cinq. La prochaine "
    "étape consistera à déployer des capteurs réels sur une parcelle test "
    "pour valider le dispositif en conditions réelles."
)

add_image("capteur_IoT.jpg", 4.5)
add_caption("Figure 6 — Interface de monitoring des capteurs IoT")

add_page_break()

# ===================================================================
# ADMINISTRATION
# ===================================================================

add_heading("Administration et back-office", level=1)

add_para(
    "AgriScan AI dispose d'un panneau d'administration complet, accessible "
    "uniquement aux utilisateurs disposant du rôle « admin ». Ce back-office "
    "permet de superviser l'ensemble de la plateforme."
)

add_heading("Gestion des utilisateurs", level=2)
add_para(
    "L'interface d'administration affiche la liste de tous les comptes utilisateurs "
    "avec leurs informations essentielles : nom, email, rôle et date de création. "
    "L'administrateur peut visualiser et gérer les comptes directement depuis "
    "cette interface. Un système de rôles distingue les agriculteurs des "
    "administrateurs, chaque rôle étant clairement identifié par un badge."
)

add_heading("Statut du modèle IA", level=2)
add_para(
    "Le panneau affiche en temps réel le statut du modèle d'intelligence "
    "artificielle utilisé par la plateforme — actuellement Llama 70B via Groq. "
    "L'indicateur confirme que le service est opérationnel et accessible sans "
    "limite de crédits."
)

add_image("admin_page.jpg", 4.5)
add_caption("Figure 7 — Panneau d'administration")

add_page_break()

# ===================================================================
# RÉSULTATS & MÉTRIQUES
# ===================================================================

add_heading("Résultats et métriques", level=1)

add_para(
    "Le projet AgriScan AI a abouti à une application fonctionnelle complète, "
    "dont voici les principaux indicateurs de réalisation :"
)

metrics = [
    "Deux plateformes livrées simultanément : mobile (iOS, Android) et web",
    "Environ vingt-trois endpoints API REST documentés et fonctionnels",
    "Un agent IA expert en pathologie végétale, propulsé par Llama 70B",
    "Cinq modules complets : diagnostic, assistant conversationnel, tableau de bord, alertes géolocalisées, profil",
    "Un back-office d'administration avec gestion des utilisateurs",
    "Une architecture IoT simulée, prête pour un déploiement physique",
    "Migration réussie de la plateforme no-code Emergent vers une architecture FastAPI autonome",
    "Design system SYNAPSE cohérent sur l'ensemble de l'interface",
    "Support multiplateforme via un code source unique (Expo)",
]

for metric in metrics:
    p = doc.add_paragraph(style='List Bullet')
    p.text = metric

add_para(
    "L'API backend expose les groupes de fonctionnalités suivants, tous "
    "testés et validés : authentification (inscription, connexion), gestion "
    "des utilisateurs (profil, mot de passe), diagnostics (création, liste, "
    "détail, changement de statut, suppression), chat IA conversationnel avec "
    "analyse d'images, alertes géolocalisées, et statistiques du tableau de bord."
)

add_page_break()

# ===================================================================
# PERSPECTIVES
# ===================================================================

add_heading("Perspectives et évolutions", level=1)

add_para(
    "AgriScan AI constitue une base solide, mais de nombreuses évolutions "
    "sont envisagées pour en faire un outil professionnel complet. Voici "
    "les principales pistes de développement identifiées."
)

add_heading("Déploiement de capteurs réels", level=2)
add_para(
    "L'infrastructure IoT est aujourd'hui conçue et simulée. La prochaine "
    "étape consistera à déployer des capteurs LoRaWAN physiques sur une parcelle "
    "test, en partenariat avec la Chambre d'Agriculture, afin de remonter des "
    "données réelles de température, d'humidité et de luminosité. Ces données "
    "permettront d'alimenter des modèles prédictifs plus fins."
)

add_heading("Mode hors-ligne", level=2)
add_para(
    "Les exploitations agricoles ne bénéficient pas toujours d'une connexion "
    "internet stable, en particulier dans les zones rurales. Nous prévoyons "
    "d'implémenter un cache local permettant de prendre des photos et de poser "
    "des diagnostics même sans connexion, avec une synchronisation automatique "
    "des données dès le retour du réseau."
)

add_heading("Notifications push", level=2)
add_para(
    "L'envoi d'alertes en temps réel via expo-notifications permettra d'informer "
    "instantanément l'agriculteur lorsqu'un risque phytosanitaire est détecté sur "
    "l'une de ses parcelles, sans qu'il ait besoin d'ouvrir l'application."
)

add_heading("Tests terrain et validation", level=2)
add_para(
    "La validation de l'application sur des cas réels, en partenariat avec la "
    "Chambre d'Agriculture, constitue une étape essentielle. Il s'agira de mesurer "
    "la précision des diagnostics sur le terrain, de recueillir les retours des "
    "utilisateurs finaux, et d'itérer sur l'interface et les algorithmes en "
    "conséquence."
)

add_heading("Enrichissement du modèle IA", level=2)
add_para(
    "À plus long terme, nous envisageons d'affiner le modèle par fine-tuning sur "
    "un corpus spécialisé de pathologie végétale, d'élargir la base de connaissances "
    "à davantage de cultures et de maladies, et d'intégrer des données contextuelles "
    "(météo, saison, région) pour améliorer la précision des diagnostics."
)

add_page_break()

# ===================================================================
# CONCLUSION
# ===================================================================

add_heading("Conclusion", level=1)

add_heading("Bilan des réalisations", level=2)
add_para(
    "Le projet AgriScan AI a atteint l'ensemble des objectifs fixés par le cahier "
    "des charges. Nous avons conçu et développé une application mobile et web "
    "fonctionnelle de diagnostic agricole assisté par intelligence artificielle, "
    "en réponse à une problématique concrète formulée par la Chambre d'Agriculture. "
    "L'application couvre l'ensemble des modules demandés — diagnostic IA, carte "
    "interactive, tableau de bord, administration, gestion de compte — et y ajoute "
    "un assistant conversationnel et des alertes géolocalisées."
)

add_para(
    "Sur le plan technique, le projet démontre la viabilité d'une architecture "
    "moderne combinant React Native/Expo pour le frontend multiplateforme, FastAPI "
    "pour le backend, MongoDB pour la persistance, et les modèles Llama de Meta via "
    "Groq pour l'intelligence artificielle. La migration réussie depuis la plateforme "
    "no-code Emergent vers une architecture autonome constitue une preuve solide de "
    "notre capacité d'adaptation et de notre maîtrise technique."
)

add_heading("Analyse critique", level=2)
add_para(
    "Si le bilan global est positif, nous devons reconnaître certaines limites "
    "de la version actuelle. Le système d'authentification, volontairement simplifié "
    "pour le MVP, ne repose pas sur un mécanisme de jetons (JWT) mais sur un état "
    "local stocké en mémoire — une solution fonctionnelle pour la démonstration mais "
    "insuffisante pour un déploiement en production."
)

add_para(
    "La gestion des mots de passe en clair dans la base de données constitue une "
    "autre faiblesse assumée du MVP, qui devra être corrigée par l'ajout d'un "
    "hachage sécurisé (bcrypt) avant toute mise en production. Les données IoT, "
    "actuellement simulées, devront être connectées à des capteurs réels pour "
    "apporter une valeur ajoutée tangible aux utilisateurs."
)

add_para(
    "Enfin, la précision du diagnostic IA, bien que prometteuse lors de nos tests, "
    "n'a pas encore été validée sur un large échantillon de cas réels. Cette "
    "validation terrain constitue un prérequis indispensable avant un éventuel "
    "déploiement commercial."
)

add_heading("Mot de la fin", level=2)
add_para(
    "AgriScan AI incarne la rencontre entre trois mondes : l'agriculture, "
    "l'intelligence artificielle et le développement no-code/low-code. Ce projet "
    "nous a permis d'explorer concrètement comment les technologies émergentes "
    "peuvent apporter des réponses pragmatiques aux défis du monde agricole. "
    "Il constitue une base solide sur laquelle de futures promotions pourront "
    "s'appuyer pour poursuivre le développement et, peut-être un jour, voir "
    "AgriScan AI déployé dans les champs."
)

add_page_break()

# ===================================================================
# BIBLIOGRAPHIE / WEBOGRAPHIE
# ===================================================================

add_heading("Bibliographie et webographie", level=1)

refs = [
    "Meta AI — Llama 3.1 70B : modèle de langage open source. https://llama.meta.com",
    "Groq — Plateforme d'inférence IA. https://groq.com",
    "Expo — Framework React Native multiplateforme. https://expo.dev",
    "FastAPI — Framework web Python haute performance. https://fastapi.tiangolo.com",
    "MongoDB — Base de données orientée documents. https://mongodb.com",
    "Motor — Driver MongoDB asynchrone pour Python. https://motor.readthedocs.io",
    "Plantix — Application de diagnostic végétal. https://plantix.net",
    "LoRaWAN — Protocole réseau longue portée pour l'IoT. https://lora-alliance.org",
]

for ref in refs:
    p = doc.add_paragraph(style='List Bullet')
    p.text = ref

add_page_break()

# ===================================================================
# ANNEXES
# ===================================================================

add_heading("Annexes", level=1)

add_heading("Annexe A — Liste des endpoints API", level=2)

endpoints = [
    ("POST /api/auth/signup", "Création de compte utilisateur"),
    ("POST /api/auth/login", "Connexion utilisateur"),
    ("GET /api/users/{uid}", "Profil utilisateur"),
    ("PATCH /api/users/{uid}", "Modification du profil"),
    ("PATCH /api/users/{uid}/password", "Changement de mot de passe"),
    ("POST /api/diagnostics", "Création d'un diagnostic"),
    ("GET /api/diagnostics/{user_id}", "Liste des diagnostics"),
    ("GET /api/diagnostics/{id}/detail", "Détail d'un diagnostic"),
    ("PATCH /api/diagnostics/{id}/status", "Changement de statut"),
    ("DELETE /api/diagnostics/{id}", "Suppression d'un diagnostic"),
    ("POST /api/chat", "Envoi d'un message à l'IA"),
    ("GET /api/messages/{diagnostic_id}", "Historique de conversation"),
    ("POST /api/alerts/{user_id}", "Création d'une alerte"),
    ("GET /api/alerts/{user_id}", "Liste des alertes"),
    ("PATCH /api/alerts/{id}/read", "Marquer une alerte comme lue"),
    ("GET /api/stats/{user_id}", "Statistiques utilisateur"),
]

table3 = doc.add_table(rows=len(endpoints)+1, cols=2)
table3.style = 'Light Grid Accent 1'
table3.alignment = WD_TABLE_ALIGNMENT.CENTER

# Header
table3.rows[0].cells[0].text = "Endpoint"
table3.rows[0].cells[1].text = "Description"
for cell in table3.rows[0].cells:
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            run.bold = True
            run.font.size = Pt(9)

for i, (ep, desc) in enumerate(endpoints):
    table3.rows[i+1].cells[0].text = ep
    table3.rows[i+1].cells[1].text = desc
    for cell in table3.rows[i+1].cells:
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(9)

add_para("")

add_heading("Annexe B — Captures d'écran complémentaires", level=2)
add_para("Vue des alertes (liste) :")
add_image("alert_page.jpg", 4.5)
add_caption("Figure 8 — Liste des alertes avec filtres")

# ===================================================================
# SAVE
# ===================================================================

doc.save(OUTPUT_PATH)
print(f"Rapport généré avec succès : {OUTPUT_PATH}")
