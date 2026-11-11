#!/usr/bin/env python3
"""Produit en/index.html et en/qyklo/index.html à partir des pages françaises.
Chaque phrase de la table doit exister une fois au moins dans la page française :
sinon le script s'arrête (une phrase modifiée en français sans mise à jour ici).
Usage : python3 scripts/traduire.py"""
import pathlib, sys
racine = pathlib.Path(__file__).resolve().parent.parent

COMMUN = [
    ("<p class=\"note-stats\">Mesure d'audience anonyme, sans cookie (GoatCounter).</p>", '<p class="note-stats">Anonymous, cookie-free visit statistics (GoatCounter).</p>'),
    ('aria-label="Yassine Kaabar, accueil"', 'aria-label="Yassine Kaabar, home"'),
    ('aria-label="Navigation principale"', 'aria-label="Main navigation"'),
    ('#parcours">Parcours</a>', '#parcours">Background</a>'),
    ('<span class="lab">Titre</span>', '<span class="lab">Title</span>'),
    ('<span class="lab">Dessiné par</span>', '<span class="lab">Drawn by</span>'),
    ('<span class="lab">Remarque</span>', '<span class="lab">Remarks</span>'),
    ('<span class="lab">Feuille</span>', '<span class="lab">Sheet</span>'),
    ('· Rév. A', '· Rev. A'),
    ('<nav aria-label="Liens">', '<nav aria-label="Links">'),
    ('class="lang" href="en/" hreflang="en" lang="en" aria-label="English version">EN</a>', 'class="lang" href="../" hreflang="fr" lang="fr" aria-label="Version française">FR</a>'),
    ('class="lang" href="../en/qyklo/" hreflang="en" lang="en" aria-label="English version">EN</a>', 'class="lang" href="../../qyklo/" hreflang="fr" lang="fr" aria-label="Version française">FR</a>'),
]

ACCUEIL = [
    ('content="Ingénieur Qualité, plus de 5 ans en électronique de haute précision (ISO 9001, ISO 13485). Qualité clients et fournisseurs, lancements produits, SPC. Applications web pour la qualité et Qyklo."',
     'content="Quality Engineer, over 5 years in high-precision electronics (ISO 9001, ISO 13485). Customer and supplier quality, product launches, SPC. Web applications for quality, and Qyklo."'),
    ('content="Plus de 5 ans en qualité industrielle. Rendement porté de 89 % à 98 % par la SPC, zéro réclamation client en 3 ans sur les lancements."',
     'content="Over 5 years in industrial quality. Yield raised from 89 % to 98 % through SPC, zero customer complaints in 3 years on product launches."'),
    ('aria-hidden="true">5+ ans · ISO 13485</div>', 'aria-hidden="true">5+ years · ISO 13485</div>'),
    ("Plus de 5 ans en qualité industrielle dans l'électronique de haute précision, certifiée ISO&nbsp;9001 et ISO&nbsp;13485&nbsp;: qualité clients et fournisseurs, lancements de nouveaux produits, amélioration des procédés par la donnée. Je conçois aussi mes propres outils qualité.",
     "Over 5 years in industrial quality in high-precision electronics, certified to ISO&nbsp;9001 and ISO&nbsp;13485: customer and supplier quality, new product launches, data-driven process improvement. I also design my own quality tools."),
    ('Yassine_Kaabar_CV.pdf" download>', 'Yassine_Kaabar_CV_EN.pdf" download>'),
    ('              Télécharger mon CV</a>', '              Download my CV</a>'),
    ('<b>89 → 98 %</b><span>de rendement grâce à la SPC automatisée</span>', '<b>89 → 98 %</b><span>yield through automated SPC</span>'),
    ('<b>0</b><span>réclamation client en 3 ans sur les lancements</span>', '<b>0</b><span>customer complaints in 3 years on product launches</span>'),
    ('<b>−30 %</b><span>de réclamations fournisseurs, 40 fournisseurs pilotés</span>', '<b>−30 %</b><span>supplier complaints, 40 suppliers managed</span>'),
    ('<b>17,3 → 0 %</b><span>de rebut au fraisage en 7 mois</span>', '<b>17.3 → 0 %</b><span>milling scrap in 7 months</span>'),
    ('<span>Rendement <b>89 → 98 %</b></span>', '<span>Yield <b>89 → 98 %</b></span>'),
    ('assets/og/fr-accueil.png', 'assets/og/en-accueil.png'),
    ('<meta property="og:url" content="https://ykaabar.github.io/">', '<meta property="og:url" content="https://ykaabar.github.io/en/">'),
    ('<html lang="fr">', '<html lang="en">'),
    ('<title>Yassine Kaabar · Ingénieur Qualité</title>', '<title>Yassine Kaabar · Quality Engineer</title>'),
    ('content="Yassine Kaabar · Ingénieur Qualité"', 'content="Yassine Kaabar · Quality Engineer"'),
    ('href="assets/', 'href="../assets/'), ('src="assets/', 'src="../assets/'),
    ('href="./" aria-label', 'href="./" aria-label'),
    ('<span class="k">Ingénieur Qualité</span>', '<span class="k">Quality Engineer</span>'),
    ('>Découvrir mes applications</a>', '>Explore my applications</a>'),
    ('Voir mon profil LinkedIn</a>', 'View my LinkedIn profile</a>'),
    ('<span class="k">Ensemble</span>', '<span class="k">Assembly</span>'),
    ('<h2>Qyklo, le système qualité complet</h2>', '<h2>Qyklo, the complete quality system</h2>'),
    ("Après les mini-apps, l'outil complet&nbsp;: Qyklo pilote tout le système de management de la qualité, ISO&nbsp;9001 et ISO&nbsp;13485, à la place des fichiers Excel dispersés. Il reprend le cœur des mini-apps et y ajoute tout le reste, organisé selon le cycle PDCA.",
     "After the mini-apps, the complete tool: Qyklo runs the whole quality management system, ISO&nbsp;9001 and ISO&nbsp;13485, instead of scattered Excel files. It takes over the core of the mini-apps and adds everything else, organised around the PDCA cycle."),
    ('<dd>Politique, objectifs, KPI, revues, risques</dd>', '<dd>Policy, objectives, KPIs, reviews, risks</dd>'),
    ('<dd>Alertes et rebuts à la tablette, audits terrain, dérogations</dd>', '<dd>Tablet alerts and scrap, floor audits, deviations</dd>'),
    ('<dd>Audits, analyses, capabilité, métrologie</dd>', '<dd>Audits, analytics, capability, metrology</dd>'),
    ('<dd>Réclamations client, 8D, SCAR, actions correctives</dd>', '<dd>Customer complaints, 8D, SCAR, corrective actions</dd>'),
    ('>Découvrir Qyklo</a>', '>Explore Qyklo</a>'),
    ('>Essayer la démo</a>', '>Try the demo</a>'),
    ("aria-label=\"Les mini-apps SPC, ECME et SCAR rejoignent le cycle PDCA de Qyklo : Plan, Do, Check puis Act s'allument, la queue orange sort, le cycle est bouclé.\"",
     'aria-label="The SPC, gauge control and SCAR mini-apps join the Qyklo PDCA cycle: Plan, Do, Check then Act light up, the orange tail comes out, the cycle is closed."'),
    ('<span class="k">Applications</span>', '<span class="k">Applications</span>'),
    ('<h2>Des outils nés du terrain</h2>', '<h2>Tools born on the shop floor</h2>'),
    ("Chaque application remplace une tâche que je faisais à la main. Elles tiennent chacune dans un seul fichier, s'ouvrent dans le navigateur et enregistrent les données dans un dossier partagé&nbsp;: rien à installer, aucun serveur.",
     "Each application replaces a task I used to do by hand. Each one fits in a single file, opens in the browser and saves its data to a shared folder: nothing to install, no server."),
    ('alt="SPC Supervision : indicateurs de capabilité et carte de contrôle"', 'alt="SPC Supervision: capability indicators and control chart"'),
    ('<p>Cartes de contrôle et capabilités à partir des mesures machine, écran opérateur avec arrêt production.</p>', '<p>Control charts and capability from machine measurements, operator screen with line stop.</p>'),
    ("<span class=\"go\">Lire l'étude</span>", '<span class="go">Read the case study</span>'),
    ('alt="SCAR : tableau de bord des réclamations fournisseurs"', 'alt="SCAR: supplier complaints dashboard"'),
    ('<span class="k">Fournisseurs</span>', '<span class="k">Suppliers</span>'),
    ('<h3>SCAR et 8D</h3>', '<h3>SCAR and 8D</h3>'),
    ('<p>Réclamations fournisseurs, suivi des 8D étape par étape, PPM et évaluation fournisseurs.</p>', '<p>Supplier complaints, step-by-step 8D follow-up, PPM and supplier rating.</p>'),
    ('<span>KPI fournisseurs <b>1 h → instantané</b></span>', '<span>Supplier KPIs <b>1 h → instant</b></span>'),
    ('alt="Mur qualité OQC : taux de rejet et lots refusés"', 'alt="OQC quality wall: rejection rate and rejected lots"'),
    ('<span class="k">Expédition</span>', '<span class="k">Shipping</span>'),
    ("<p>Contrôle final par lot selon l'ISO 2859-1, taux de rejet, non-conformités.</p>", '<p>Final lot inspection to ISO 2859-1, rejection rate, non-conformities.</p>'),
    ('<span>KPI <b>automatiques</b></span>', '<span>KPIs <b>automatic</b></span>'),
    ("alt=\"ECME : parc d'équipements et échéances d'étalonnage\"", 'alt="Gauge control: equipment fleet and calibration due dates"'),
    ('<span class="k">Métrologie</span>', '<span class="k">Metrology</span>'),
    ('<h3>ECME</h3>', '<h3>Gauge control</h3>'),
    ("<p>Registre des équipements de mesure, échéances d'étalonnage, planning.</p>", '<p>Measuring equipment register, calibration due dates, planning.</p>'),
    ("<span>Parc <b>prêt pour l'audit</b></span>", '<span>Fleet <b>audit-ready</b></span>'),
    ("alt=\"Gage R&R : saisie de l'étude et résultat instantané\"", 'alt="Gage R&R: study data entry and instant result"'),
    ('<span class="k">Système de mesure</span>', '<span class="k">Measurement system</span>'),
    ('<p>Étude MSA type 2 avec verdict instantané et guide de la méthode.</p>', '<p>MSA type 2 study with instant verdict and a method guide.</p>'),
    ('<span>Méthode <b>expliquée</b></span>', '<span>Method <b>explained</b></span>'),
    ('<h2>Un poste en qualité à pourvoir&nbsp;?</h2>', '<h2>Hiring for a quality role?</h2>'),
    ('<p>Je vous présente volontiers ces outils plus en détail, code compris.</p>', "<p>I'd be glad to walk you through these tools in more detail, code included.</p>"),
    ('>Me contacter sur LinkedIn</a>', '>Contact me on LinkedIn</a>'),
    ('<span class="val">Portfolio · Ingénieur Qualité</span>', '<span class="val">Portfolio · Quality Engineer</span>'),
    ('<span class="val">Code des applications disponible sur demande</span>', '<span class="val">Application source code available on request</span>'),
]

QYKLO = [
    ('assets/og/fr-qyklo.png', 'assets/og/en-qyklo.png'),
    ('<meta property="og:url" content="https://ykaabar.github.io/qyklo/">', '<meta property="og:url" content="https://ykaabar.github.io/en/qyklo/">'),
    ('<html lang="fr" data-charte="qyklo" data-polices="qyklo">', '<html lang="en" data-charte="qyklo" data-polices="qyklo">'),
    ('content="Qyklo : application de pilotage du système de management de la qualité, ISO 9001 et ISO 13485. Actions, réclamations et 8D, audits, fournisseurs, KPI, atelier connecté."',
     'content="Qyklo: quality management system software, ISO 9001 and ISO 13485. Actions, complaints and 8D, audits, suppliers, KPIs, connected shop floor."'),
    ('content="Qyklo · le cycle qualité, enfin visible"', 'content="Qyklo · the quality cycle, finally visible"'),
    ('href="../assets/', 'href="../../assets/'), ('src="../assets/', 'src="../../assets/'),
    ('>← Revenir à l\'accueil</a>', '>← Back to home</a>'),
    ('<span class="k">Système qualité · Qyklo</span>', '<span class="k">Quality system · Qyklo</span>'),
    ('<h1>Le cycle qualité, enfin visible</h1>', '<h1>The quality cycle, finally visible</h1>'),
    ("Qyklo pilote le système de management de la qualité d'un sous-traitant industriel, ISO&nbsp;9001 et ISO&nbsp;13485&nbsp;: réclamations et 8D, audits, fournisseurs, dérogations, KPI et revues. Un seul outil à la place des fichiers Excel dispersés.",
     "Qyklo runs the quality management system of an industrial subcontractor, ISO&nbsp;9001 and ISO&nbsp;13485: complaints and 8D, audits, suppliers, deviations, KPIs and reviews. One tool instead of scattered Excel files."),
    ('<span>Atelier connecté</span>', '<span>Connected shop floor</span>'),
    ('>Essayer la démo</a>', '>Try the demo</a>'),
    ('>Parcourir les modules</a>', '>Browse the modules</a>'),
    ("aria-label=\"Les mini-apps SPC, ECME et SCAR rejoignent le cycle PDCA de Qyklo : Plan, Do, Check puis Act s'allument, la queue orange sort, le cycle est bouclé.\"",
     'aria-label="The SPC, gauge control and SCAR mini-apps join the Qyklo PDCA cycle: Plan, Do, Check then Act light up, the orange tail comes out, the cycle is closed."'),
    ('<span class="k">Le nom</span>', '<span class="k">The name</span>'),
    ("Qyklo vient du grec <i>kyklos</i>, le cercle, le cycle&nbsp;: celui du PDCA et de l'amélioration continue. Le Q est celui de la qualité, le Y et le K sont mes initiales. Le logo est un Q formé du cycle&nbsp;: quatre segments Plan, Do, Check, Act, et une queue orange qui en sort comme le résultat qu'il produit.",
     "Qyklo comes from the Greek <i>kyklos</i>, the circle, the cycle: the PDCA cycle of continuous improvement. The Q stands for quality, the Y and the K are my initials. The logo is a Q made of the cycle: four segments, Plan, Do, Check, Act, and an orange tail coming out of it, like the result it produces."),
    ('<span class="k">Le problème</span>', '<span class="k">The problem</span>'),
    ('<h2>Un système qualité éclaté en dizaines de fichiers</h2>', '<h2>A quality system scattered across dozens of files</h2>'),
    ('<h3>Avant</h3>', '<h3>Before</h3>'),
    ('<li>Un fichier Excel par sujet : réclamations, audits, fournisseurs, métrologie</li>', '<li>One Excel file per topic: complaints, audits, suppliers, metrology</li>'),
    ('<li>Des actions dispersées, chacune avec sa propre règle de retard</li>', '<li>Scattered actions, each with its own overdue rule</li>'),
    ("<li>Des preuves d'audit à reconstituer avant chaque certification</li>", '<li>Audit evidence to rebuild before every certification</li>'),
    ('<li>Un atelier déconnecté du service qualité</li>', '<li>A shop floor disconnected from the quality department</li>'),
    ('<h3>Avec Qyklo</h3>', '<h3>With Qyklo</h3>'),
    ("<li>Un seul tableau d'actions, une seule règle de retard</li>", '<li>One action list, one overdue rule</li>'),
    ("<li>L'état de chaque action et de chaque 8D dessiné comme le cycle PDCA</li>", '<li>The status of every action and every 8D drawn as the PDCA cycle</li>'),
    ("<li>Les preuves d'audit produites en travaillant</li>", '<li>Audit evidence produced as you work</li>'),
    ("<li>La tablette et l'écran de l'atelier reliés au système qualité</li>", '<li>Shop floor tablet and screen connected to the quality system</li>'),
    ("<span class=\"k\">L'application</span>", '<span class="k">The application</span>'),
    ('<h2>Tout le cycle PDCA dans un seul outil</h2>', '<h2>The whole PDCA cycle in one tool</h2>'),
    ('<h3>Plan · piloter</h3>', '<h3>Plan · steer</h3>'),
    ('<li>Politique qualité versionnée, objectifs et feuille de route</li>', '<li>Versioned quality policy, objectives and roadmap</li>'),
    ('<li>KPI calculés automatiquement, position par rapport à la cible</li>', '<li>KPIs computed automatically, position against target</li>'),
    ('<li>Revues de processus et de direction, figées puis approuvées</li>', '<li>Process and management reviews, frozen then approved</li>'),
    ('<li>Registres : enjeux, parties intéressées, risques et opportunités</li>', '<li>Registers: issues, interested parties, risks and opportunities</li>'),
    ('<h3>Do · produire</h3>', '<h3>Do · produce</h3>'),
    ('<li>Alertes qualité à la tablette et écran TV par secteur</li>', '<li>Quality alerts on the tablet and a TV screen per area</li>'),
    ('<li>Rebuts déclarés au poste, étiquette Datamatrix scannée</li>', '<li>Scrap declared at the workstation, Datamatrix label scanned</li>'),
    ('<li>Audits terrain : audit de poste, 5S, LPA</li>', '<li>Floor audits: workstation audit, 5S, LPA</li>'),
    ('<li>Dérogations, maîtrise des modifications, validation des procédés spéciaux</li>', '<li>Deviations, change control, special process validation</li>'),
    ('<h3>Check · vérifier</h3>', '<h3>Check · verify</h3>'),
    ("<li>Programme d'audit, constats, auditeurs qualifiés</li>", '<li>Audit programme, findings, qualified auditors</li>'),
    ('<li>Analyses Pareto, tendances et coût de la non-qualité</li>', '<li>Pareto analysis, trends and cost of poor quality</li>'),
    ('<li>Études de capabilité, métrologie, satisfaction client</li>', '<li>Capability studies, metrology, customer satisfaction</li>'),
    ('<li>Page Exigences ISO : chaque paragraphe et les preuves qui le couvrent</li>', '<li>ISO requirements page: every clause and the evidence covering it</li>'),
    ('<h3>Act · améliorer</h3>', '<h3>Act · improve</h3>'),
    ('<li>Réclamations client et 8D : Ishikawa, 5 pourquoi, rapport Word FR et EN</li>', '<li>Customer complaints and 8D: Ishikawa, 5 whys, Word report in French and English</li>'),
    ('<li>Réclamations fournisseur et SCAR imprimable</li>', '<li>Supplier complaints and printable SCAR</li>'),
    ('<li>Actions correctives et préventives dans un tableau unique</li>', '<li>Corrective and preventive actions in a single list</li>'),
    ('<li>« Déjà vu ? » : les cas similaires des 24 derniers mois</li>', '<li>“Seen before?”: similar cases from the last 24 months</li>'),
    ("<span class=\"k\">L'héritage</span>", '<span class="k">The legacy</span>'),
    ('<h2>Ce que Qyklo reprend des mini-apps</h2>', '<h2>What Qyklo takes over from the mini-apps</h2>'),
    ("Les mini-apps ont servi de terrain d'essai. Qyklo reprend leur cœur dans un système commun&nbsp;; OQC et Gage R&amp;R restent des outils autonomes, plus spécifiques.",
     "The mini-apps served as a testing ground. Qyklo brings their core into one shared system; OQC and Gage R&amp;R remain standalone, more specialised tools."),
    ('<b>SCAR et 8D → Act</b><span>Réclamations fournisseur, SCAR et 8D complets avec analyse des causes.</span>', '<b>SCAR and 8D → Act</b><span>Supplier complaints, SCAR and full 8D with root cause analysis.</span>'),
    ("<b>ECME → Check</b><span>Parc d'équipements, étalonnages, évaluation d'impact si hors tolérance.</span>", '<b>Gauge control → Check</b><span>Equipment fleet, calibrations, impact assessment when out of tolerance.</span>'),
    ('<b>SPC → Check</b><span>Études de capabilité archivées, cartes de contrôle et règles de Nelson.</span>', '<b>SPC → Check</b><span>Archived capability studies, control charts and Nelson rules.</span>'),
    ('<span class="k">Captures</span>', '<span class="k">Screenshots</span>'),
    ("<h2>L'application en images</h2>", '<h2>The application in pictures</h2>'),
    ('<p>Données de la démo, fictives.</p>', '<p>Fictitious demo data. Interface in French; SCAR and 8D reports are also available in English.</p>'),
    ("alt=\"Fiche 8D : étapes D0 à D8, diagramme d'Ishikawa, traçabilité et actions liées\"", 'alt="8D record: steps D0 to D8, Ishikawa diagram, traceability and linked actions"'),
    ("<b>8D.</b> Les étapes D0 à D8, l'Ishikawa des causes racines et les actions liées.", '<b>8D.</b> Steps D0 to D8, the root cause Ishikawa and the linked actions.'),
    ('alt="Politique qualité, axes, objectifs et feuille de route"', 'alt="Quality policy, axes, objectives and roadmap"'),
    ('<b>Plan.</b> Politique, objectifs et feuille de route.', '<b>Plan.</b> Policy, objectives and roadmap.'),
    ('alt="Audit de poste à la tablette"', 'alt="Workstation audit on the tablet"'),
    ("<b>Do.</b> Audit de poste à la tablette, à l'atelier.", '<b>Do.</b> Workstation audit on the tablet, on the shop floor.'),
    ("alt=\"Analyses qualité : l'essentiel et la tendance mensuelle\"", 'alt="Quality analytics: key findings and monthly trend"'),
    ("<b>Check.</b> L'essentiel des analyses et la tendance mensuelle.", '<b>Check.</b> Key findings and the monthly trend.'),
    ('alt="Tableau unique des actions avec statut et échéance"', 'alt="Single action list with status and due date"'),
    ('<b>Act.</b> Un seul tableau pour toutes les actions.', '<b>Act.</b> One list for every action.'),
    ('alt="Cartes KPI avec objectif et tendance"', 'alt="KPI cards with target and trend"'),
    ('<b>KPI.</b> Chaque indicateur face à sa cible, avec sa tendance.', '<b>KPIs.</b> Every indicator against its target, with its trend.'),
    ("alt=\"Écran TV d'un secteur : alertes en vigueur et rebuts du jour\"", 'alt="Area TV screen: active alerts and scrap of the day"'),
    ('<b>Écran atelier.</b> Alertes en vigueur et rebuts du jour, par secteur.', '<b>Shop floor screen.</b> Active alerts and scrap of the day, per area.'),
    ('<span class="k">Sous le capot</span>', '<span class="k">Under the hood</span>'),
    ('<h2>Conçu pour un système certifié</h2>', '<h2>Built for a certified system</h2>'),
    ('<b>Django et HTMX</b><span>Rendu côté serveur, aucune dépendance chargée depuis Internet.</span>', '<b>Django and HTMX</b><span>Server-side rendering, no dependency loaded from the Internet.</span>'),
    ('<b>Historique de chaque fiche</b><span>Qui a modifié quoi et quand, pour la maîtrise des enregistrements.</span>', '<b>History of every record</b><span>Who changed what and when, for control of records.</span>'),
    ('<b>Droits par groupe</b><span>Qualité, pilotes, direction, contributeurs ; décisions réservées aux comptes nominatifs.</span>', '<b>Group-based permissions</b><span>Quality, process owners, management, contributors; decisions reserved for named accounts.</span>'),
    ("<b>ISO 13485 ciblée</b><span>Les exigences dispositif médical ne s'appliquent qu'aux fiches des clients medtech.</span>", '<b>Targeted ISO 13485</b><span>Medical device requirements apply only to medtech customer records.</span>'),
    ('<b>Documents FR et EN</b><span>SCAR, rapport 8D et export Word dans la langue du client ou du fournisseur.</span>', "<b>French and English documents</b><span>SCAR, 8D report and Word export in the customer's or supplier's language.</span>"),
    ('<b>Sécurité</b><span>Double authentification, blocage des essais de mot de passe, HTTPS imposé.</span>', '<b>Security</b><span>Two-factor authentication, password attempt lockout, HTTPS enforced.</span>'),
    ('<h2>Voir Qyklo en vrai</h2>', '<h2>See Qyklo live</h2>'),
    ('<p>La démo publique tourne avec des données fictives : parcourez les 8D, les KPI et la tablette.</p>', '<p>The public demo runs on fictitious data: browse the 8Ds, the KPIs and the tablet.</p>'),
    ('<nav class="pager" aria-label="Autres applications">', '<nav class="pager" aria-label="Other applications">'),
    ('<span>← Précédente</span>', '<span>← Previous</span>'),
    ('<span>Suivante →</span>', '<span>Next →</span>'),
    ('<span class="val">Qyklo · pilotage du système qualité</span>', '<span class="val">Qyklo · quality system management</span>'),
    ('<span class="val">Démo publique avec données fictives</span>', '<span class="val">Public demo with fictitious data</span>'),
]

import re
def sections(s, src):
    """Remplace les sections longues par leur version anglaise (scripts/i18n/<id>.en.html).
    La copie <id>.fr.html doit être identique à la section française : sinon la version
    anglaise est en retard, le script s'arrête."""
    for fr in sorted((racine / 'scripts/i18n').glob('*.fr.html')):
        sid = fr.name.split('.')[0]
        m = re.search(r'  <section id="%s"[^>]*>.*?\n  </section>' % sid, s, re.S)
        if not m:
            continue
        if m.group(0) != fr.read_text(encoding='utf-8'):
            sys.exit(f'{src} : la section « {sid} » a changé en français. Mettre à jour scripts/i18n/{sid}.en.html, puis recopier la section dans {sid}.fr.html.')
        s = s.replace(m.group(0), (racine / f'scripts/i18n/{sid}.en.html').read_text(encoding='utf-8'))
    return s

def traduire(src, dst, table):
    s = (racine / src).read_text(encoding='utf-8')
    manquants = [a for a, _ in COMMUN + table if a not in s and a not in ('class="lang" href="en/" hreflang="en" lang="en" aria-label="English version">EN</a>', 'class="lang" href="../en/qyklo/" hreflang="en" lang="en" aria-label="English version">EN</a>')]
    if manquants:
        sys.exit(f'{src} : phrases introuvables, mettre à jour la table :\n  ' + '\n  '.join(m[:90] for m in manquants))
    s = sections(s, src)
    for a, b in table + COMMUN:
        s = s.replace(a, b)
    (racine / dst).parent.mkdir(parents=True, exist_ok=True)
    (racine / dst).write_text(s, encoding='utf-8')
    print(f'✓ {dst}')

traduire('index.html', 'en/index.html', ACCUEIL)
traduire('qyklo/index.html', 'en/qyklo/index.html', QYKLO)
