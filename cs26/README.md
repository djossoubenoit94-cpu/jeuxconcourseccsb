# Plateforme du jeu-concours biblique et doctrinal 2026
Église des Chérubins et Séraphins — compétition du 24 décembre 2026.
Source unique des contenus : le document officiel de préparation (27 pages).

## Lancer le site
Aucune installation : c'est un site statique (HTML/CSS/JavaScript).
- **Test rapide** : ouvrir `index.html` dans un navigateur.
- **Mise en ligne** : déposer tout le dossier sur un hébergement statique (Netlify Drop, GitHub Pages, Cloudflare Pages, ou n'importe quel hébergeur web). Le lien obtenu fonctionne sur téléphone, tablette et ordinateur.
- **Tests automatiques** : `node tests.js` (vérifie ids uniques, couverture des 17 catégories, maximum 50 questions, absence de doublons, renouvellement, QCM valides).

## Contenu du projet
```
*.html            une page par rubrique (index, programme, revision, entrainement, concours, rapidite, mentor)
css/style.css     identité visuelle (ivoire, bordeaux, vert forêt, doré discret)
js/data.js        BASE DE QUESTIONS (à enrichir ici)
js/engine.js      moteur de tirage aléatoire et de présentation des questions
js/app.js         interface : accueil, programme, révision, modes, mentor
tests.js          tests du moteur
```

## Fonctionnalités opérationnelles
- **Accueil** : identité, date et compte à rebours, progression réelle.
- **Programme** : 11 catégories doctrinales + 6 chapitres bibliques, avec accès révision/entraînement par catégorie.
- **Révision** : cartes à retourner (question → réponse, référence, page du PDF).
- **Entraînement** : catégorie au choix, 10/20/30/50 questions, correction immédiate, sans chronomètre.
- **Concours blanc** : doctrine + Bible mélangées, chronomètre par question (réglable), correction à la fin, score, % de réussite, catégories maîtrisées / à réviser, « Revoir mes erreurs », « Nouvelle tentative ».
- **Rapidité** : temps limité, points bonus si réponse dans la première moitié du temps.
- **Mentor** : banque complète filtrable, historique, difficultés récurrentes, ajout/suppression de questions complémentaires (étiquetées « complémentaire », distinctes des « officielles »).
- **Correction** : réponse donnée, réponse correcte, résultat, explication, référence biblique, page du PDF.

## Moteur aléatoire (js/engine.js)
- Jamais plus de 50 questions par tentative, jamais de doublon dans une tentative.
- Les questions non encore posées sont prioritaires ; les catégories sont alternées (tirage « à tour de rôle »).
- La mémoire des questions vues est stockée dans le navigateur ; quand tout a été vu, un nouveau cycle commence.
- Chaque question est présentée au hasard en QCM (propositions mélangées, leurres pris dans les réponses de la même catégorie), en Vrai/Faux ou en réponse directe (auto-évaluation après affichage de la réponse).

## Ajouter ou corriger des questions
Dans `js/data.js`, ajouter une ligne :
`["G1","Question ?","Réponse","Genèse 1:1",13,1,"Explication facultative"]`
(catégorie, question, réponse, référence biblique, page du PDF, difficulté 1-3, explication). Le moteur, les statistiques et le mode mentor la prennent en compte automatiquement.

## Limites connues (à lire avant de distribuer)
1. **Base de 293 questions officielles** : les **154 questions-réponses bibliques du PDF** (Genèse 1 : 27, Genèse 2 : 25, Genèse 3 : 24, Matthieu 1 : 23, Matthieu 2 : 29, Matthieu 3 : 26, soit l'intégralité, avec la page du PDF) et **139 questions doctrinales** tirées de toutes les informations des pages 7 à 12. Le PDF ne contient pas de questions-réponses pour la doctrine, seulement des faits : ces questions ont donc été formulées à partir de ces faits, sans rien ajouter d'extérieur.
2. **Explications** : les questions bibliques ont la référence et la page ; une explication rédigée n'existe que pour quelques-unes. Sinon, la correction affiche la référence et la page source.
3. **Types non implantés** : classement chronologique, correspondance et développement. Les types disponibles sont QCM, Vrai/Faux et réponse directe (auto-évaluée).
4. **Mentor** : pas de comptes ni de mot de passe ; données stockées localement sur l'appareil. « Interrogations collectives » et suivi multi-enfants nécessitent le module comptes/serveur prévu pour une évolution (les questions et les résultats ont déjà des structures prêtes à être envoyées vers une base de données).
5. **Vérification du contenu doctrinal** : les faits doctrinaux sont repris tels quels du PDF et n'ont pu être validés par aucune autre source. À relire par la Coordination générale. Les références bibliques sont celles du PDF, vérifiées contre les chapitres du programme.
6. Aucun fait extérieur au PDF n'a été ajouté.

## Mise à jour v2 : navigation et couleurs
- **Défilement sur une seule page** : Accueil, Programme, Révision, Entraînement, Concours blanc, Rapidité et Mentor sont les unes sous les autres. Le menu (fixe en haut) fait défiler doucement jusqu'à la rubrique, et un soulignement doré indique la rubrique en cours.
- Chaque questionnaire se déroule **dans sa propre rubrique** ; son affichage, ses résultats et la logique du moteur sont inchangés. Les liens existants (« Réviser », « S'entraîner », « Abandonner »…) fonctionnent toujours et ramènent à la bonne section. L'accueil et l'espace mentor se mettent à jour à la fin d'un test.
- **Palette** : bleu (#1d4e89, #2b6cb0, #0f2a4f), blanc bleuté (#f4f8fd) et touche ambre discrète (#e0a83c). Elle se change en haut de `css/style.css` ; les noms de variables (--bo, --fo, --go…) datent de l'ancienne palette et ont été conservés volontairement.
- La version précédente reste disponible dans `plateforme-concours-2026-v1.zip`.

## Mise à jour v3 : pages séparées et menu ☰
- Le site est de nouveau composé de **pages séparées** (un fichier HTML par rubrique) ; le défilement sur une seule page de la v2 est supprimé, ainsi que les liens d'ancrage et le défilement doux.
- **Menu** : une barre en haut avec le bouton ☰ « Menu ». Un clic ouvre un panneau listant les sept pages (la page courante est marquée) ; il se referme après le choix d'un lien, au clic en dehors ou avec la touche Échap. Il fonctionne sur ordinateur et téléphone.
- Les liens internes passent par l'adresse de la page, par exemple `revision.html?cat=G1` (révision de Genèse 1) ou `entrainement.html?cat=M3`.
- Les données (progression, questions du mentor, réglages) sont partagées entre les pages via le stockage local du navigateur. Questionnaires, moteur, résultats, contenus et couleurs sont inchangés.
- Quitter une page pendant un test l'interrompt, comme toute navigation entre pages.
- Les versions précédentes restent disponibles dans leurs zips respectifs.

## Mise à jour v4 : base de questions complétée
- Toutes les questions du PDF sont maintenant dans la base et sur le site (entraînement, concours blanc, rapidité, révision, mentor) : 129 → 293 questions.
- Les questions qui regroupaient deux questions du PDF (ex. « Jour ; Nuit ») ont été séparées pour respecter le PDF.
- Aucune fonctionnalité n'a été modifiée : seule la base `js/data.js` a changé.
