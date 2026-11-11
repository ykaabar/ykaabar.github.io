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

const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const li = a => a.map(x => `<li>${e(x)}</li>`).join('\n            ');
const num = n => n ? `\n          <div class="big-num"><div><b>${e(n[0])}</b><span>${e(n[1])}</span></div></div>` : '';

function page(p, i) {
  /* Cycle de navigation : Qyklo → SPC → SCAR → OQC → ECME → Gage R&R → Qyklo */
  const QYKLO = { slug: 'qyklo', nom: 'Qyklo' };
  const prec = i === 0 ? QYKLO : PAGES[i - 1], suiv = i === PAGES.length - 1 ? QYKLO : PAGES[i + 1];
  const figure = ([img, t, d, alt], k) => `        <figure class="${k === 0 ? 'wide ' : ''}reveal">
          <div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="../assets/img/${img}.webp" alt="${e(alt)}" loading="lazy" width="1600" height="1000"></div>
          <figcaption><b>${e(t)}</b> ${e(d)}</figcaption>
        </figure>`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(p.nom)} · Yassine Kaabar</title>
<meta name="description" content="${e(p.description)}">
<meta property="og:title" content="${e(p.titre)}">
<meta property="og:image" content="https://ykaabar.github.io/assets/img/${p.vues[0][0]}.webp">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23141920'/%3E%3Ctext x='16' y='21' font-family='monospace' font-size='13' font-weight='600' fill='white' text-anchor='middle'%3EYK%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="brand" href="../" aria-label="Yassine Kaabar, accueil"><span class="mark" aria-hidden="true">YK</span><span class="name">Yassine Kaabar</span></a>
    <nav class="nav" aria-label="Navigation principale">
      <a href="../#parcours">Parcours</a>
      <a href="../#applications">Applications</a>
      <a class="btn pri" href="${LINKEDIN}" rel="noopener">LinkedIn</a>
    </nav>
  </div>
</header>

<main>
  <section class="app-hero">
    <div class="wrap">
      <a class="crumb" href="../#applications">← Revenir aux applications</a>
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
        <span class="k">Le problème</span>
        <h2>${e(p.probleme)}</h2>
      </div>
      <div class="compare">
        <div class="panel before reveal">
          <h3>Avant</h3>
          <ol class="steps">
            ${li(p.avant)}
          </ol>${num(p.avantNum)}
        </div>
        <div class="panel after reveal">
          <h3>Maintenant</h3>
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
          <span class="k">Sur le terrain</span>
          <p>${e(p.impact)}</p>
        </div>
      </div>
    </div>
  </section>
` : ''}
  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">L'application</span>
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
        <span class="k">Captures</span>
        <h2>L'application en images</h2>
        <p>Données d'exemple fictives.</p>
      </div>
      <div class="gallery">
${p.vues.map(figure).join('\n')}
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <div class="sec-head reveal">
        <span class="k">Sous le capot</span>
        <h2>Simple à déployer, solide à l'usage</h2>
      </div>
      <div class="methods">
${p.capot.map(([t, d]) => `        <div class="method reveal"><b>${e(t)}</b><span>${e(d)}</span></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="tight">
    <div class="wrap">
      <nav class="pager" aria-label="Autres applications">
        <a href="../${prec.slug}/"><span>← Précédente</span><b>${e(prec.nom)}</b></a>
        <a class="next" href="../${suiv.slug}/"><span>Suivante →</span><b>${e(suiv.nom)}</b></a>
      </nav>
    </div>
  </section>
</main>

<footer class="cartouche">
  <div class="wrap">
    <div class="cart">
      <div class="full"><span class="lab">Titre</span><span class="val">${e(p.titre)}</span></div>
      <div><span class="lab">Dessiné par</span><span class="val">Yassine Kaabar</span></div>
      <div><span class="lab">Date</span><span class="val">11.2026</span></div>
      <div class="full"><span class="lab">Remarque</span><span class="val">Code des applications disponible sur demande</span></div>
      <div><span class="lab">Feuille</span><span class="val">${i + 3} / ${PAGES.length + 2} · Rév. A</span></div>
      <div><span class="lab">Contact</span><nav aria-label="Liens"><a href="${LINKEDIN}" rel="noopener">LinkedIn</a><a href="https://github.com/ykaabar" rel="noopener">GitHub</a></nav></div>
    </div>
  </div>
</footer>
<script src="../assets/site.js"></script>
</body>
</html>
`;
}

PAGES.forEach((p, i) => {
  const dir = path.join(racine, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(p, i));
  console.log(`✓ ${p.slug}/index.html`);
});
