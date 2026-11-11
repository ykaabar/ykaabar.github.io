#!/usr/bin/env node
/* Génère les pages d'applications (spc/, scar/, oqc/, ecme/, gage-rr/) à partir
   du contenu ci-dessous, pour qu'elles gardent toutes le même gabarit.
   Usage : node scripts/pages.js
   La page d'accueil (index.html) est écrite à la main. */
'use strict';
const fs = require('fs');
const path = require('path');
const racine = path.resolve(__dirname, '..');
const LINKEDIN = 'https://www.linkedin.com/in/yassine-kaabar-b6230b159';

const PAGES = [
  {
    slug: 'spc', nom: 'SPC', domaine: 'Production · SPC', chart: 'spc',
    titre: 'SPC · maîtrise statistique des procédés',
    description: 'Application SPC : cartes de contrôle et capabilités à partir des mesures machine, rapports en quelques clics, écran opérateur avec alerte et arrêt production.',
    h1: "Voir la dérive avant qu'elle n'arrive chez le client",
    lede: "Les mesures de la machine deviennent des cartes de contrôle, des capabilités et des rapports, sans copier-coller. Au poste, l'opérateur voit la dérive et la production s'arrête d'elle-même quand il le faut.",
    meta: ['Cartes de contrôle', 'Cp · Cpk · Pp · Ppk', 'Keyence IM'],
    chartLabel: "Carte de contrôle : les mesures restent dans les limites puis dérivent, le dernier point dépasse la tolérance et déclenche une alerte.",
    probleme: 'Avant : aucun suivi, et des rapports faits à la main',
    avant: ['Extraire les mesures à la main depuis la machine', 'Les coller dans un fichier Excel en allemand', "Faire une capture d'écran du résultat", 'Recommencer pour chaque cote à suivre', 'Tout coller dans un rapport Word, aux images de tailles différentes'],
    avantNum: ['1 à 2 h', 'par rapport, et aucun suivi pendant la production'],
    apres: ["L'app lit directement les exports de la machine de mesure", 'Cartes, capabilités et règles de détection sont calculées pour chaque cote', "Le rapport, interne ou client, se génère et s'imprime en PDF", "Au poste, l'opérateur suit chaque pièce en temps réel"],
    apresNum: ['Quelques clics', 'pour un rapport propre, et un vrai suivi de la fraiseuse'],
    impact: "Les statistiques de suivi ont permis de remonter à la cause racine d'un défaut de fraisage. Avec l'outil en place, la dérive aurait été visible bien avant d'atteindre le client.",
    appTitre: 'Deux écrans, deux métiers',
    blocs: [
      ['Supervision · qualité et responsables', 'Analyser un produit, une cote, une période ou des OF choisis.',
        ['Cartes X/MR, X̄/R et trois voies par OF', 'Capabilités Cp, Cpk, Pp, Ppk et écarts-types intra et global', 'Détection des points hors limites, séries et tendances', 'Limites de référence figées et historisées', 'Rapports interne et client prêts à imprimer']],
      ["Poste · opérateur à l'atelier", 'Un écran lisible de loin, relu automatiquement toutes les 30 secondes.',
        ['Dernière pièce mesurée, position dans la tolérance', "Moyenne glissante et zone d'acceptation pour voir la dérive", 'Alerte technicien quand la moyenne sort de la zone', 'Arrêt production après 3 pièces non conformes de suite', 'Reprise après 5 pièces conformes et libération nommée']]
    ],
    vues: [
      ['spc-sup-analyse', 'Supervision.', 'Capabilités, règles de détection et carte des valeurs individuelles sur trois OF.', 'Supervision : indicateurs de capabilité et carte des valeurs individuelles sur trois OF'],
      ['spc-poste-courbes', 'Poste opérateur.', 'La moyenne glissante sort de la zone : alerte technicien, puis arrêt.', "Poste opérateur : alerte technicien, bandeau d'arrêt production et courbe des dernières pièces"],
      ['spc-poste-arret', 'Arrêt production.', "Impossible à manquer depuis l'autre bout de l'atelier.", "Écran plein d'arrêt production avec les trois pièces hors tolérance"],
      ['spc-sup-xbar', 'Carte X̄/R.', 'Moyennes et étendues par sous-groupe.', 'Carte des moyennes X barre / R par sous-groupes'],
      ['spc-sup-rapport', 'Rapport.', 'Version interne ou client, prête à imprimer en PDF.', 'Aperçu du rapport de maîtrise statistique prêt à imprimer']
    ],
    capot: [
      ['Un fichier HTML', "S'ouvre dans Edge ou Chrome. Rien à installer, aucun serveur."],
      ['Lecture directe des exports', 'Les CSV de la machine Keyence sont relus automatiquement.'],
      ['Paramètres par produit', "Cotes, tolérances et seuils d'alerte dans un fichier partagé."],
      ['Journal des réactions', 'Chaque alerte et chaque libération sont tracées.'],
      ['Clair et sombre', "Le poste reste en sombre pour l'atelier, la supervision au choix."],
      ['Socle commun', 'Même thème et même stockage que les autres applications.']
    ]
  },
  {
    slug: 'scar', nom: 'SCAR et 8D', domaine: 'Fournisseurs · SCAR et 8D', chart: 'scar',
    titre: 'SCAR et 8D · réclamations fournisseurs',
    description: 'Application SCAR : réclamations fournisseurs avec PDF en anglais, suivi des 8D étape par étape, PPM et évaluation fournisseurs calculés automatiquement.',
    h1: 'Du défaut fournisseur au 8D clos, sans ressaisie',
    lede: "Une réclamation fournisseur se crée en trois minutes, part avec son PDF en anglais et se suit étape par étape jusqu'à la clôture du 8D. Les indicateurs fournisseurs se calculent tout seuls.",
    meta: ['SCAR', '8D', 'PPM', 'Évaluation fournisseurs'],
    chartLabel: "Les huit étapes d'un 8D fournisseur, de D1 à D8, se valident l'une après l'autre jusqu'à la clôture.",
    probleme: 'Avant : chaque réclamation coûtait du temps de saisie',
    avant: ['10 min pour rédiger une SCAR', "2 min pour l'envoyer au fournisseur", '10 min pour clore chaque étape de 8D', 'Des relances à faire à la main', "Plus d'une heure pour calculer les indicateurs"],
    avantNum: ['Plus de 1 h', 'rien que pour les indicateurs fournisseurs'],
    apres: ['3 min pour rédiger une SCAR', "Quelques secondes pour l'envoyer, PDF en anglais compris", '1 à 2 min par étape de 8D, enregistrée proprement', 'Échéances et retards visibles sans rien chercher'],
    apresNum: ['Instantané', 'les indicateurs sont à jour en permanence'],
    appTitre: 'De la réclamation à la revue de direction',
    blocs: [
      ['Réclamations et 8D', 'Tout le cycle de vie d\'une SCAR au même endroit.',
        ['Création guidée de la SCAR, PDF en anglais pour le fournisseur', 'Suivi du 8D étape par étape, de D3 à la clôture', 'Échéances D3, D5 et clôture, retards mis en évidence', "Vérification d'efficacité après clôture", 'Mode audit pour une présentation client ou certification']],
      ['Fournisseurs et indicateurs', 'Les chiffres se calculent à partir des réceptions.',
        ['PPM par fournisseur sur 12 mois glissants', "Import de l'export SAP des réceptions", 'Score et classement A, B, C des fournisseurs', 'Délai moyen de clôture des 8D', 'Revue de direction exportée en PDF']]
    ],
    vues: [
      ['scar-accueil', 'Accueil.', 'SCAR ouvertes, 8D en retard, délai de clôture et PPM en un coup d\'œil.', 'Accueil SCAR : indicateurs clés et SCAR émises par mois'],
      ['scar-8d', 'Pipeline des 8D.', 'Chaque SCAR classée par étape en cours.', 'Pipeline des 8D classés par étape : confinement, actions correctives, mise en œuvre, prévention'],
      ['scar-detail', 'Détail d\'une SCAR.', 'Avancement du 8D, échéances et fiche du défaut.', "Détail d'une SCAR avec la progression du 8D et les échéances"],
      ['scar-fournisseurs', 'Fournisseurs.', 'PPM, nombre de SCAR et score par fournisseur.', 'Liste des fournisseurs avec PPM, SCAR et score'],
      ['scar-dashboard', 'Dashboard.', 'Les indicateurs de la revue de direction.', 'Dashboard qualité fournisseurs avec indicateurs et graphiques mensuels']
    ],
    capot: [
      ['Un fichier HTML', "S'ouvre dans Edge ou Chrome. Rien à installer, aucun serveur."],
      ['Dossier partagé', 'Une SCAR par fichier : plusieurs personnes travaillent en même temps.'],
      ['Rien n\'est écrasé', "Si un collègue a modifié la même SCAR, l'app le détecte et demande quoi garder."],
      ['PDF et Excel', 'SCAR en PDF, registre et revue de direction exportables.'],
      ['Corbeille', 'Toute suppression garde une copie récupérable.'],
      ['Socle commun', 'Même thème et même stockage que les autres applications.']
    ]
  },
  {
    slug: 'oqc', nom: 'OQC', domaine: 'Expédition · OQC', chart: 'oqc',
    titre: 'OQC · contrôle avant expédition',
    description: "Application OQC : contrôle final par lot selon l'ISO 2859-1, plan d'échantillonnage automatique, taux de rejet et non-conformités.",
    h1: 'Le bon échantillon, le bon verdict, à chaque lot',
    lede: "Avant expédition, l'app donne la taille de l'échantillon et les critères d'acceptation selon l'ISO 2859-1, enregistre le contrôle et tient le taux de rejet à jour.",
    meta: ['ISO 2859-1', 'Taux de rejet', 'Non-conformités'],
    chartLabel: "Un lot de 150 pièces : 20 pièces sont prélevées selon l'ISO 2859-1, un défaut est trouvé, le lot est refusé.",
    probleme: 'Avant : des indicateurs calculés à la main',
    avant: ['Indicateurs de contrôle final calculés à la main', 'Une présentation à refaire à chaque fois'],
    avantNum: ['Quelques minutes', 'à chaque calcul d\'indicateur'],
    apres: ["Le plan d'échantillonnage se calcule dès la saisie du lot", 'Le verdict tombe avec le nombre de défauts', 'Taux de rejet et indicateurs à jour après chaque contrôle', 'Des rapports de non-conformité propres, prêts à partager'],
    apresNum: ['Automatique', 'et une présentation professionnelle'],
    appTitre: 'Du lot contrôlé à la non-conformité traitée',
    blocs: [
      ['Contrôle par lot', 'La saisie suit le déroulé du contrôle.',
        ["Plan d'échantillonnage ISO 2859-1 : lettre-code, taille, Ac et Re", 'Niveau de contrôle et NQA par client', 'Verdict OK ou NOK calculé à la saisie des défauts', 'Phases série et prototype suivies séparément', 'Historique complet, export du registre']],
      ['Suivi et non-conformités', 'Ce qui sort du contrôle est suivi jusqu\'au bout.',
        ['Taux de rejet par mois, par phase et par client', 'Objectif affiché et écart à l\'objectif', 'Fiche de non-conformité pour chaque lot refusé', 'Rapport de non-conformité imprimable', 'Derniers lots refusés toujours visibles']]
    ],
    vues: [
      ['oqc-dashboard', 'Tableau de bord.', 'Taux de rejet, lots contrôlés et évolution sur 12 mois.', 'Tableau de bord OQC : taux de rejet, lots contrôlés et évolution mensuelle'],
      ['oqc-controle', 'Nouveau contrôle.', "Le plan d'échantillonnage se remplit tout seul.", "Formulaire de nouveau contrôle avec plan d'échantillonnage"],
      ['oqc-historique', 'Historique.', 'Tous les contrôles, filtrables et exportables.', 'Historique des contrôles enregistrés'],
      ['oqc-nc', 'Non-conformités.', 'Les lots refusés et l\'état de leur traitement.', 'Liste des non-conformités ouvertes sur les lots refusés'],
      ['oqc-clients', 'Clients.', 'Niveau de contrôle et NQA par défaut pour chaque client.', 'Liste des clients avec niveau de contrôle et NQA']
    ],
    capot: [
      ['Un fichier HTML', "S'ouvre dans Edge ou Chrome. Rien à installer, aucun serveur."],
      ['Tables de la norme intégrées', "Lettre-code, taille d'échantillon, Ac et Re sans ouvrir la norme."],
      ['Dossier partagé', 'Un contrôle par fichier, numéroté automatiquement.'],
      ['Rien n\'est écrasé', "Les modifications d'un autre poste sont détectées."],
      ['Export Excel', 'Le registre des contrôles sort en un clic.'],
      ['Socle commun', 'Même thème et même stockage que les autres applications.']
    ]
  },
  {
    slug: 'ecme', nom: 'ECME', domaine: 'Métrologie · ECME', chart: 'ecme',
    titre: 'ECME · équipements de mesure',
    description: "Application ECME : registre des équipements de mesure, échéances d'étalonnage, planning et contrôles en retard.",
    h1: "Un parc de mesure toujours prêt pour l'audit",
    lede: "Chaque équipement de contrôle, de mesure et d'essai a sa fiche, son statut et sa prochaine échéance. Les retards se voient avant que l'auditeur ne les trouve.",
    meta: ['Étalonnage', 'Planning', 'Registre'],
    chartLabel: "Un instrument est contrôlé : l'aiguille se stabilise dans la zone de tolérance, l'équipement est déclaré conforme.",
    probleme: 'Avant : un fichier Excel qui ne disait pas tout',
    avant: ['Tout le parc dans un fichier Excel', 'Des équipements disparus encore listés comme actifs', "Des retards d'étalonnage qui n'en étaient pas"],
    avantNum: ['18', "équipements actifs à tort dans l'ancien fichier"],
    apres: ['Chaque équipement a un statut clair : suivi, hors suivi, réformé', 'Échéances et retards recalculés chaque jour', 'Planning des contrôles internes et des envois externes', 'Registre exportable pour le présenter tel quel'],
    apresNum: ['Parc à jour', 'et présentable en audit'],
    impact: "La mise en place de l'outil a révélé 18 équipements encore actifs alors qu'ils n'existaient plus. Dans l'ancien fichier, ils apparaissaient en retard d'étalonnage : l'application a mis l'écart en évidence avant qu'un auditeur ne le fasse.",
    appTitre: 'Le parc, les échéances, les décisions',
    blocs: [
      ['Registre et échéances', "L'état du parc en un écran.",
        ['Fiche par équipement : localisation, périodicité, étalonnage interne ou externe', 'Contrôles en retard et échéances à 30 jours', 'Taux de conformité du parc', 'Équipements hors suivi et réformés séparés des actifs', 'Import depuis Excel, export du registre']],
      ['Contrôles et planning', 'De la saisie du résultat à la décision.',
        ["Saisie du contrôle et calcul de la prochaine échéance", 'Résultats NOK : équipement bloqué, décision à prendre', 'Planning sur 3 mois', 'Envois regroupés par laboratoire externe', 'Étude Gage R&R lancée depuis la fiche']]
    ],
    vues: [
      ['ecme-accueil', 'Tableau de bord.', 'Conformité du parc, retards et échéances à venir.', 'Tableau de bord ECME : équipements suivis, retards et échéances'],
      ['ecme-parc', 'Parc.', 'Tous les équipements, filtrables par localisation et statut.', 'Liste des équipements du parc avec échéances'],
      ['ecme-planning', 'Planning.', 'Les contrôles des trois prochains mois et les envois externes.', 'Planning des contrôles à venir sur trois mois']
    ],
    capot: [
      ['Un fichier HTML', "S'ouvre dans Edge ou Chrome. Rien à installer, aucun serveur."],
      ['Dossier partagé', 'Un seul registre, lu par tous les postes.'],
      ['Fusion des modifications', 'Deux personnes peuvent mettre le parc à jour en même temps.'],
      ['Sauvegarde quotidienne', 'Une copie du registre est gardée chaque jour.'],
      ['Lié au Gage R&R', "L'étude R&R s'ouvre avec l'équipement déjà renseigné."],
      ['Socle commun', 'Même thème et même stockage que les autres applications.']
    ]
  },
  {
    slug: 'gage-rr', nom: 'Gage R&R', domaine: 'Système de mesure · Gage R&R', chart: 'rr',
    titre: 'Gage R&R · analyse du système de mesure',
    description: 'Application Gage R&R : étude MSA type 2 par la méthode des moyennes et étendues, verdict instantané, rapport imprimable et guide de la méthode.',
    h1: "Savoir si l'on peut se fier à la mesure",
    lede: "Une étude R&R dit quelle part de la variation vient du moyen de mesure et des opérateurs. L'app guide la saisie, calcule le résultat en direct et explique comment le lire.",
    meta: ['MSA type 2', 'AIAG MSA', 'C++ / WebAssembly'],
    chartLabel: "La variation mesurée se décompose en répétabilité, reproductibilité et variation des pièces ; le R&R atteint 26,7 %, acceptable sous conditions.",
    probleme: 'Avant : une méthode mal comprise',
    avant: ["Une méthode peu connue en dehors de la qualité", 'Des résultats difficiles à interpréter', "Un outil peu lisible"],
    apres: ['Le verdict se met à jour pendant la saisie', 'Des feuilles de relevé à ordre aléatoire, prêtes à imprimer', "Un guide intégré : à quoi sert l'étude, comment lire le résultat", 'Un rapport propre à joindre au dossier'],
    appTitre: "De la feuille de relevé au rapport",
    blocs: [
      ["L'étude", 'Méthode des moyennes et étendues, selon le manuel AIAG MSA.',
        ['10 pièces, 3 opérateurs, 3 essais par défaut', '%R&R rapporté à la tolérance et à la variation totale', 'Nombre de catégories distinctes (ndc)', 'Décision : capable, sous conditions, non capable', 'Jeu de données de référence pour vérifier le calcul']],
      ['Autour de l\'étude', 'Ce qui rend la méthode utilisable par tous.',
        ['Feuilles de relevé avec ordre de passage tiré au hasard', 'Rapport imprimable avec les composantes de variation', 'Guide : but, réalisation, lecture des résultats', "Ouverture directe depuis la fiche d'un équipement ECME", 'Thème clair ou sombre']]
    ],
    vues: [
      ['rr-saisie', 'Saisie.', 'Le résultat se calcule pendant la saisie des mesures.', "Saisie de l'étude R&R avec résultat instantané"],
      ['rr-rapport', 'Rapport.', 'Décision, indicateurs et composantes de variation.', "Rapport de l'étude R&R avec décision et composantes de variation"],
      ['rr-feuilles', 'Feuilles de relevé.', "L'ordre aléatoire évite que l'opérateur se souvienne des valeurs.", 'Feuille de relevé avec plan de mesure aléatoire'],
      ['rr-guide', 'Guide.', 'La méthode expliquée simplement.', 'Guide du Gage R&R : à quoi il sert et comment l\'utiliser']
    ],
    capot: [
      ['Un fichier HTML', "S'ouvre dans Edge ou Chrome. Rien à installer, aucun serveur."],
      ['Moteur de calcul en C++', 'Compilé en WebAssembly et intégré dans la page.'],
      ['Calcul vérifiable', 'Le jeu de référence du manuel AIAG redonne les valeurs attendues.'],
      ['Études enregistrables', 'Une étude se sauvegarde et se rouvre plus tard.'],
      ['Lié à ECME', "L'équipement étudié vient du registre de métrologie."],
      ['Socle commun', 'Même thème que les autres applications.']
    ]
  }
];

/* Version anglaise : mêmes clés que PAGES, textes traduits. Termes normés gardés (8D, SCAR, Cpk, CAPA…). */
const EN = {
  spc: {
    nom: 'SPC', domaine: 'Production · SPC',
    titre: 'SPC · statistical process control',
    description: 'SPC application: control charts and capability from machine measurements, reports in a few clicks, operator screen with alert and line stop.',
    h1: 'Spot the drift before it reaches the customer',
    lede: 'Machine measurements become control charts, capability indices and reports, with no copy-pasting. At the workstation, the operator sees the drift and production stops by itself when it has to.',
    meta: ['Control charts', 'Cp · Cpk · Pp · Ppk', 'Keyence IM'],
    chartLabel: 'Control chart: measurements stay within limits, then drift; the last point exceeds the tolerance and triggers an alert.',
    probleme: 'Before: no monitoring, and reports built by hand',
    avant: ['Export the measurements from the machine by hand', 'Paste them into an Excel file set up in German', 'Take a screenshot of the result', 'Repeat for every dimension to monitor', 'Paste everything into a Word report, with images of different sizes'],
    avantNum: ['1 to 2 h', 'per report, and no monitoring during production'],
    apres: ['The app reads the measuring machine exports directly', 'Charts, capability and detection rules are computed for every dimension', 'The report, internal or customer, is generated and printed to PDF', 'At the workstation, the operator follows every part in real time'],
    apresNum: ['A few clicks', 'for a clean report, and real monitoring of the milling machine'],
    impact: 'Process monitoring statistics made it possible to trace a milling defect back to its root cause. With the tool in place, the drift would have been visible long before it reached the customer.',
    appTitre: 'Two screens, two jobs',
    blocs: [
      ['Supervision · quality and managers', 'Analyse a product, a dimension, a period or selected work orders.',
        ['X/MR, X̄/R and three-way charts by work order', 'Cp, Cpk, Pp, Ppk capability, within and overall standard deviations', 'Detection of out-of-limit points, runs and trends', 'Frozen, versioned reference limits', 'Internal and customer reports ready to print']],
      ['Workstation · operator on the shop floor', 'A screen readable from a distance, refreshed every 30 seconds.',
        ['Last part measured, position within the tolerance', 'Moving average and acceptance zone to see the drift', 'Technician alert when the average leaves the zone', 'Line stop after 3 consecutive non-conforming parts', 'Restart after 5 conforming parts and a named release']]
    ],
    vues: [
      ['Supervision.', 'Capability, detection rules and individual values chart over three work orders.', 'Supervision: capability indicators and individual values chart over three work orders'],
      ['Operator workstation.', 'The moving average leaves the zone: technician alert, then line stop.', 'Operator workstation: technician alert, line stop banner and last parts chart'],
      ['Line stop.', 'Impossible to miss from the other end of the shop floor.', 'Full-screen line stop with the three out-of-tolerance parts'],
      ['X̄/R chart.', 'Averages and ranges by subgroup.', 'X-bar / R chart by subgroup'],
      ['Report.', 'Internal or customer version, ready to print to PDF.', 'Preview of the statistical process control report, ready to print']
    ],
    capot: [
      ['A single HTML file', 'Opens in Edge or Chrome. Nothing to install, no server.'],
      ['Direct export reading', 'The Keyence machine CSV files are reread automatically.'],
      ['Settings by product', 'Dimensions, tolerances and alert thresholds in a shared file.'],
      ['Reaction log', 'Every alert and every release is recorded.'],
      ['Light and dark', 'The workstation stays dark for the shop floor, supervision as you like.'],
      ['Shared foundation', 'Same theme and same storage as the other applications.']
    ]
  },
  scar: {
    nom: 'SCAR and 8D', domaine: 'Suppliers · SCAR and 8D',
    titre: 'SCAR and 8D · supplier complaints',
    description: 'SCAR application: supplier complaints with an English PDF, step-by-step 8D follow-up, PPM and supplier rating computed automatically.',
    h1: 'From supplier defect to closed 8D, with no re-entry',
    lede: 'A supplier complaint is created in three minutes, sent with its PDF and followed step by step until the 8D is closed. Supplier indicators compute themselves.',
    meta: ['SCAR', '8D', 'PPM', 'Supplier rating'],
    chartLabel: 'The eight steps of a supplier 8D, from D1 to D8, are validated one after another until closure.',
    probleme: 'Before: every complaint cost data-entry time',
    avant: ['10 min to write a SCAR', '2 min to send it to the supplier', '10 min to close each 8D step', 'Reminders to send by hand', 'Over an hour to compute the indicators'],
    avantNum: ['Over 1 h', 'just for the supplier indicators'],
    apres: ['3 min to write a SCAR', 'A few seconds to send it, PDF included', '1 to 2 min per 8D step, properly recorded', 'Due dates and delays visible at a glance'],
    apresNum: ['Instant', 'indicators are always up to date'],
    appTitre: 'From complaint to management review',
    blocs: [
      ['Complaints and 8D', 'The whole life cycle of a SCAR in one place.',
        ['Guided SCAR creation, English PDF for the supplier', 'Step-by-step 8D follow-up, from D3 to closure', 'D3, D5 and closure due dates, delays highlighted', 'Effectiveness check after closure', 'Audit mode for a customer or certification presentation']],
      ['Suppliers and indicators', 'Figures are computed from goods receipts.',
        ['PPM per supplier over a rolling 12 months', 'Import of the SAP goods receipt export', 'A, B, C supplier score and ranking', 'Average 8D closure time', 'Management review exported to PDF']]
    ],
    vues: [
      ['Home.', 'Open SCARs, overdue 8Ds, closure time and PPM at a glance.', 'SCAR home: key indicators and SCARs issued per month'],
      ['8D pipeline.', 'Each SCAR sorted by its current step.', '8D pipeline by step: containment, corrective actions, implementation, prevention'],
      ['SCAR detail.', '8D progress, due dates and defect record.', 'SCAR detail with 8D progress and due dates'],
      ['Suppliers.', 'PPM, number of SCARs and score per supplier.', 'Supplier list with PPM, SCARs and score'],
      ['Dashboard.', 'The management review indicators.', 'Supplier quality dashboard with indicators and monthly charts']
    ],
    capot: [
      ['A single HTML file', 'Opens in Edge or Chrome. Nothing to install, no server.'],
      ['Shared folder', 'One SCAR per file: several people can work at the same time.'],
      ['Nothing gets overwritten', 'If a colleague edited the same SCAR, the app detects it and asks what to keep.'],
      ['PDF and Excel', 'SCAR as PDF, register and management review exportable.'],
      ['Recycle bin', 'Every deletion keeps a recoverable copy.'],
      ['Shared foundation', 'Same theme and same storage as the other applications.']
    ]
  },
  oqc: {
    nom: 'OQC', domaine: 'Shipping · OQC',
    titre: 'OQC · outgoing quality control',
    description: 'OQC application: final lot inspection to ISO 2859-1, automatic sampling plan, rejection rate and non-conformities.',
    h1: 'The right sample, the right verdict, for every lot',
    lede: 'Before shipping, the app gives the sample size and acceptance criteria according to ISO 2859-1, records the inspection and keeps the rejection rate up to date.',
    meta: ['ISO 2859-1', 'Rejection rate', 'Non-conformities'],
    chartLabel: 'A lot of 150 parts: 20 parts are sampled according to ISO 2859-1, one defect is found, the lot is rejected.',
    probleme: 'Before: indicators computed by hand',
    avant: ['Final inspection indicators computed by hand', 'A presentation to rebuild every time'],
    avantNum: ['A few minutes', 'for every indicator update'],
    apres: ['The sampling plan is computed as soon as the lot is entered', 'The verdict follows from the number of defects', 'Rejection rate and indicators updated after every inspection', 'Clean non-conformity reports, ready to share'],
    apresNum: ['Automatic', 'and a professional presentation'],
    appTitre: 'From inspected lot to handled non-conformity',
    blocs: [
      ['Lot inspection', 'Data entry follows the inspection itself.',
        ['ISO 2859-1 sampling plan: code letter, sample size, Ac and Re', 'Inspection level and AQL per customer', 'OK or NOK verdict computed from the defects entered', 'Series and prototype phases tracked separately', 'Full history, register export']],
      ['Follow-up and non-conformities', 'What comes out of the inspection is followed through.',
        ['Rejection rate by month, phase and customer', 'Target displayed with the gap to target', 'Non-conformity record for every rejected lot', 'Printable non-conformity report', 'Latest rejected lots always visible']]
    ],
    vues: [
      ['Dashboard.', 'Rejection rate, inspected lots and 12-month trend.', 'OQC dashboard: rejection rate, inspected lots and monthly trend'],
      ['New inspection.', 'The sampling plan fills itself in.', 'New inspection form with sampling plan'],
      ['History.', 'All inspections, filterable and exportable.', 'History of recorded inspections'],
      ['Non-conformities.', 'Rejected lots and the status of their handling.', 'List of open non-conformities on rejected lots'],
      ['Customers.', 'Default inspection level and AQL for each customer.', 'Customer list with inspection level and AQL']
    ],
    capot: [
      ['A single HTML file', 'Opens in Edge or Chrome. Nothing to install, no server.'],
      ['Standard tables built in', 'Code letter, sample size, Ac and Re without opening the standard.'],
      ['Shared folder', 'One inspection per file, numbered automatically.'],
      ['Nothing gets overwritten', 'Changes made from another workstation are detected.'],
      ['Excel export', 'The inspection register in one click.'],
      ['Shared foundation', 'Same theme and same storage as the other applications.']
    ]
  },
  ecme: {
    nom: 'Gauge control', domaine: 'Metrology · gauge control',
    titre: 'Gauge control · measuring equipment',
    description: 'Measuring equipment application: gauge register, calibration due dates, planning and overdue checks.',
    h1: 'A measuring equipment fleet always ready for audit',
    lede: 'Every inspection, measuring and test equipment has its record, its status and its next due date. Overdue items show up before the auditor finds them.',
    meta: ['Calibration', 'Planning', 'Register'],
    chartLabel: 'An instrument is checked: the needle settles within the tolerance zone, the equipment is declared compliant.',
    probleme: 'Before: an Excel file that did not tell the whole story',
    avant: ['The whole fleet in a single Excel file', 'Equipment that no longer existed still listed as active', 'Calibration delays that were not real'],
    avantNum: ['18', 'pieces of equipment wrongly active in the old file'],
    apres: ['Every item has a clear status: monitored, not monitored, retired', 'Due dates and delays recomputed every day', 'Planning of internal checks and external shipments', 'Register exportable to show as is'],
    apresNum: ['Up-to-date fleet', 'and ready to show in an audit'],
    impact: 'Rolling out the tool revealed 18 pieces of equipment still active although they no longer existed. In the old file, they showed as overdue for calibration: the application brought the gap to light before an auditor did.',
    appTitre: 'The fleet, the due dates, the decisions',
    blocs: [
      ['Register and due dates', 'The state of the fleet on one screen.',
        ['Record per item: location, interval, internal or external calibration', 'Overdue checks and 30-day due dates', 'Fleet compliance rate', 'Unmonitored and retired items kept apart from active ones', 'Import from Excel, register export']],
      ['Checks and planning', 'From entering the result to the decision.',
        ['Check entry and computation of the next due date', 'NOK results: equipment blocked, decision required', '3-month planning', 'Shipments grouped by external laboratory', 'Gage R&R study launched from the record']]
    ],
    vues: [
      ['Dashboard.', 'Fleet compliance, overdue items and upcoming due dates.', 'Gauge dashboard: monitored items, overdue items and due dates'],
      ['Fleet.', 'All equipment, filterable by location and status.', 'List of fleet equipment with due dates'],
      ['Planning.', 'Checks for the next three months and external shipments.', 'Planning of upcoming checks over three months']
    ],
    capot: [
      ['A single HTML file', 'Opens in Edge or Chrome. Nothing to install, no server.'],
      ['Shared folder', 'One register, read by every workstation.'],
      ['Merged edits', 'Two people can update the fleet at the same time.'],
      ['Daily backup', 'A copy of the register is kept every day.'],
      ['Linked to Gage R&R', 'The R&R study opens with the equipment already filled in.'],
      ['Shared foundation', 'Same theme and same storage as the other applications.']
    ]
  },
  'gage-rr': {
    nom: 'Gage R&R', domaine: 'Measurement system · Gage R&R',
    titre: 'Gage R&R · measurement system analysis',
    description: 'Gage R&R application: MSA type 2 study with the average and range method, instant verdict, printable report and method guide.',
    h1: 'Know whether you can trust the measurement',
    lede: 'An R&R study shows how much of the variation comes from the measuring equipment and from the operators. The app guides data entry, computes the result live and explains how to read it.',
    meta: ['MSA type 2', 'AIAG MSA', 'C++ / WebAssembly'],
    chartLabel: 'Measured variation breaks down into repeatability, reproducibility and part variation; R&R reaches 26.7 %, conditionally acceptable.',
    probleme: 'Before: a poorly understood method',
    avant: ['A method little known outside quality', 'Results that are hard to interpret', 'A tool that was hard to read'],
    apres: ['The verdict updates during data entry', 'Data sheets with a random order, ready to print', 'A built-in guide: what the study is for, how to read the result', 'A clean report to attach to the file'],
    appTitre: 'From data sheet to report',
    blocs: [
      ['The study', 'Average and range method, according to the AIAG MSA manual.',
        ['10 parts, 3 operators, 3 trials by default', '%R&R against tolerance and total variation', 'Number of distinct categories (ndc)', 'Decision: capable, conditionally acceptable, not capable', 'Reference data set to check the calculation']],
      ['Around the study', 'What makes the method usable by everyone.',
        ['Data sheets with a randomly drawn measuring order', 'Printable report with the variance components', 'Guide: purpose, execution, reading the results', 'Opens directly from an equipment record', 'Light or dark theme']]
    ],
    vues: [
      ['Data entry.', 'The result is computed while the measurements are entered.', 'R&R study data entry with instant result'],
      ['Report.', 'Decision, indicators and variance components.', 'R&R study report with decision and variance components'],
      ['Data sheets.', 'The random order keeps the operator from remembering values.', 'Data sheet with a random measuring plan'],
      ['Guide.', 'The method explained simply.', 'Gage R&R guide: what it is for and how to use it']
    ],
    capot: [
      ['A single HTML file', 'Opens in Edge or Chrome. Nothing to install, no server.'],
      ['C++ calculation engine', 'Compiled to WebAssembly and embedded in the page.'],
      ['Verifiable calculation', 'The AIAG manual reference data set gives back the expected values.'],
      ['Studies can be saved', 'A study can be saved and reopened later.'],
      ['Linked to gauge control', 'The studied equipment comes from the metrology register.'],
      ['Shared foundation', 'Same theme as the other applications.']
    ]
  }
};

/* Textes fixes du gabarit, par langue */
const UI = {
  fr: { accueil: 'Yassine Kaabar, accueil', nav: 'Navigation principale', parcours: 'Parcours', apps: 'Applications', retour: '← Revenir aux applications',
    probleme: 'Le problème', avant: 'Avant', apres: 'Maintenant', terrain: 'Sur le terrain', app: "L'application", captures: 'Captures', images: "L'application en images",
    fictif: "Données d'exemple fictives.", capot: 'Sous le capot', capotTitre: "Simple à déployer, solide à l'usage", autres: 'Autres applications',
    prec: '← Précédente', suiv: 'Suivante →', titre: 'Titre', dessine: 'Dessiné par', remarque: 'Remarque', codeDemande: 'Code des applications disponible sur demande',
    feuille: 'Feuille', rev: 'Rév. A', liens: 'Liens', autreLangue: 'EN', autreNom: 'English version', autreCode: 'en' },
  en: { accueil: 'Yassine Kaabar, home', nav: 'Main navigation', parcours: 'Background', apps: 'Applications', retour: '← Back to applications',
    probleme: 'The problem', avant: 'Before', apres: 'Now', terrain: 'On the shop floor', app: 'The application', captures: 'Screenshots', images: 'The application in pictures',
    fictif: 'Fictitious sample data. Interface in French.', capot: 'Under the hood', capotTitre: 'Easy to deploy, robust in use', autres: 'Other applications',
    prec: '← Previous', suiv: 'Next →', titre: 'Title', dessine: 'Drawn by', remarque: 'Remarks', codeDemande: 'Application source code available on request',
    feuille: 'Sheet', rev: 'Rev. A', liens: 'Links', autreLangue: 'FR', autreNom: 'Version française', autreCode: 'fr' }
};

const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const li = a => a.map(x => `<li>${e(x)}</li>`).join('\n            ');
const num = n => n ? `\n          <div class="big-num"><div><b>${e(n[0])}</b><span>${e(n[1])}</span></div></div>` : '';
const SITE = 'https://ykaabar.github.io';

/* Page d'une app dans une langue. Racine du site : ../ en français, ../../ en anglais. */
function page(fr, i, lang) {
  const p = lang === 'en' ? Object.assign({}, fr, EN[fr.slug], { vues: fr.vues.map((v, k) => [v[0], ...EN[fr.slug].vues[k]]) }) : fr;
  const T = UI[lang], R = lang === 'en' ? '../../' : '../', ici = lang === 'en' ? '../' : '../', base = lang === 'en' ? 'en/' : '';
  const autre = lang === 'en' ? `../../${p.slug}/` : `../en/${p.slug}/`;
  const nomDe = x => (lang === 'en' && EN[x.slug] ? EN[x.slug].nom : x.nom);
  /* Cycle de navigation : Qyklo → SPC → SCAR → OQC → ECME → Gage R&R → Qyklo */
  const QYKLO = { slug: 'qyklo', nom: 'Qyklo' };
  const prec = i === 0 ? QYKLO : PAGES[i - 1], suiv = i === PAGES.length - 1 ? QYKLO : PAGES[i + 1];
  const figure = ([img, t, d, alt], k) => `        <figure class="${k === 0 ? 'wide ' : ''}reveal">
          <div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="${R}assets/img/${img}.webp" alt="${e(alt)}" loading="lazy" width="1600" height="1000"></div>
          <figcaption><b>${e(t)}</b> ${e(d)}</figcaption>
        </figure>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(p.nom)} · Yassine Kaabar</title>
<meta name="description" content="${e(p.description)}">
<meta property="og:title" content="${e(p.titre)}">
<meta property="og:image" content="${SITE}/assets/img/${p.vues[0][0]}.webp">
<link rel="alternate" hreflang="fr" href="${SITE}/${p.slug}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/${p.slug}/">
<link rel="alternate" hreflang="x-default" href="${SITE}/${p.slug}/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23141920'/%3E%3Ctext x='16' y='21' font-family='monospace' font-size='13' font-weight='600' fill='white' text-anchor='middle'%3EYK%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${R}assets/site.css">
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="brand" href="${ici}" aria-label="${e(T.accueil)}"><span class="mark" aria-hidden="true">YK</span><span class="name">Yassine Kaabar</span></a>
    <nav class="nav" aria-label="${e(T.nav)}">
      <a href="${ici}#parcours">${T.parcours}</a>
      <a href="${ici}#applications">${T.apps}</a>
      <a class="lang" href="${autre}" hreflang="${T.autreCode}" lang="${T.autreCode}" aria-label="${e(T.autreNom)}">${T.autreLangue}</a>
      <a class="btn pri in" href="${LINKEDIN}" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z"/></svg><span class="lbl">LinkedIn</span></a>
    </nav>
  </div>
</header>

<main>
  <section class="app-hero">
    <div class="wrap">
      <a class="crumb" href="${ici}#applications">${e(T.retour)}</a>
      <div class="hero-grid">
        <div>
          <span class="k">${e(p.domaine)}</span>
          <h1>${e(p.h1)}</h1>
          <p class="lede">${e(p.lede)}</p>
          <p class="meta-line">${p.meta.map(m => `<span>${e(m)}</span>`).join('')}</p>
        </div>
        <div class="hero-art">
          <svg class="chart" data-chart="${p.chart}" role="img" aria-label="${e(p.chartLabel)}"></svg>
        </div>
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">${e(T.probleme)}</span>
        <h2>${e(p.probleme)}</h2>
      </div>
      <div class="compare">
        <div class="panel before reveal">
          <h3>${e(T.avant)}</h3>
          <ol class="steps">
            ${li(p.avant)}
          </ol>${num(p.avantNum)}
        </div>
        <div class="panel after reveal">
          <h3>${e(T.apres)}</h3>
          <ol class="steps">
            ${li(p.apres)}
          </ol>${num(p.apresNum)}
        </div>
      </div>
    </div>
  </section>
${p.impact ? `
  <section class="flush">
    <div class="wrap">
      <div class="impact reveal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l5-5 4 4 8-9"/><path d="M14 7h6v6"/></svg>
        <div>
          <span class="k">${e(T.terrain)}</span>
          <p>${e(p.impact)}</p>
        </div>
      </div>
    </div>
  </section>
` : ''}
  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">${e(T.app)}</span>
        <h2>${e(p.appTitre)}</h2>
      </div>
      <div class="feats">
${p.blocs.map(([t, d, l]) => `        <div class="panel reveal">
          <h3>${e(t)}</h3>
          <p>${e(d)}</p>
          <ul class="bullets">
            ${li(l)}
          </ul>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">${e(T.captures)}</span>
        <h2>${e(T.images)}</h2>
        <p>${e(T.fictif)}</p>
      </div>
      <div class="gallery">
${p.vues.map(figure).join('\n')}
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">${e(T.capot)}</span>
        <h2>${e(T.capotTitre)}</h2>
      </div>
      <div class="methods">
${p.capot.map(([t, d]) => `        <div class="method reveal"><b>${e(t)}</b><span>${e(d)}</span></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <nav class="pager" aria-label="${e(T.autres)}">
        <a href="../${prec.slug}/"><span>${e(T.prec)}</span><b>${e(nomDe(prec))}</b></a>
        <a class="next" href="../${suiv.slug}/"><span>${e(T.suiv)}</span><b>${e(nomDe(suiv))}</b></a>
      </nav>
    </div>
  </section>
</main>

<footer class="cartouche">
  <div class="wrap">
    <div class="cart">
      <div class="full"><span class="lab">${T.titre}</span><span class="val">${e(p.titre)}</span></div>
      <div><span class="lab">${T.dessine}</span><span class="val">Yassine Kaabar</span></div>
      <div><span class="lab">Date</span><span class="val">11.2026</span></div>
      <div class="full"><span class="lab">${T.remarque}</span><span class="val">${e(T.codeDemande)}</span></div>
      <div><span class="lab">${T.feuille}</span><span class="val">${i + 3} / ${PAGES.length + 2} · ${T.rev}</span></div>
      <div><span class="lab">Contact</span><nav aria-label="${e(T.liens)}"><a href="${LINKEDIN}" rel="noopener">LinkedIn</a><a href="https://github.com/ykaabar" rel="noopener">GitHub</a></nav></div>
    </div>
  </div>
</footer>
<script src="${R}assets/site.js"></script>
</body>
</html>
`;
}

for (const lang of ['fr', 'en']) PAGES.forEach((p, i) => {
  const dir = path.join(racine, lang === 'en' ? 'en' : '', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(p, i, lang));
  console.log(`✓ ${lang === 'en' ? 'en/' : ''}${p.slug}/index.html`);
});
