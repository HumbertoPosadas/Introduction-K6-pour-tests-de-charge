/*
    Introduction sur K6 browser
    k6 browser est inspiré par Playwright.
    Cet outil permet de faire des tests de performance sur des applications web en simulant le comportement d'un utilisateur réel dans un navigateur.
    Generalement nous utilisons K6 pour des tests API, mais K6 browser nous permet d'aller plus loin en testant l'interface utilisateur.
    Les avantages de K6 browser sont :
    - Simulation réaliste du comportement utilisateur
    - Support des technologies modernes (JavaScript, CSS, etc.)
    - Intégration facile avec les pipelines CI/CD
    - Rapports détaillés sur les performances et les erreurs
    Les inconvénients sont :
    - Courbe d'apprentissage pour les utilisateurs non familiers avec les tests de performance dans un navigateur
    - Peut nécessiter plus de ressources système pour exécuter les tests par rapport aux tests API traditionnels

    k6 browser est deja inclus dans k6, donc pas besoin d'installation supplémentaire.

    Pour executer un script k6 browser il faut lancer la meme commande que pour un script k6 classique :
    k6 run script-browser.js
*/

import { sleep } from 'k6';
import { browser } from 'k6/browser';

export const options = {
  /*
    Configuration du scénario de test. Correspond a la partie Charge de mon script k6. 
    Un scenario définit comment les utilisateurs virtuels (VUs) vont se comporter pendant le test.
    Ici le mot scenario ne vaut pas dire un script de test, mais une configuration de l'execution du test.
    Chaque scenario peut avoir son propre type d'executor, nombre de VUs, iterations, etc.
  */
    scenarios: {  
    MyCustomNScenario: {                     // Nom du scénario (peut être n'importe quel nom)
        executor: 'shared-iterations',    // Type d'exécuteur : partage des itérations entre les VUs. Types d'executors : shared-iterations, constant-vus, ramping-vus, per-vu-iterations, constant-arrival-rate, ramping-arrival-rate, externally-controlled
        vus: 1,                           // Nombre d'utilisateurs virtuels (VUs)
        iterations: 1,                    // Nombre total d'itérations à exécuter
        maxDuration: '10s',               // Durée maximale du scénario
        options: {                     // Options spécifiques à l'exécuteur
            browser: {                 // Configuration du navigateur
            type: 'chromium',   // Type de navigateur : chromium, firefox, webkit
            headless: false,     // Exécution en mode headless (sans interface graphique)
            },
      }},
    MySecondScenario:{
        executor: 'constant-vus',    // Type d'exécuteur : nombre constant de VUs pendant toute la durée du test
        vus: 5,                       // Nombre d'utilisateurs virtuels (VUs)
        duration: '10s',              // Durée totale du scénario
        options: {                     // Options spécifiques à l'exécuteur
            browser: {                 // Configuration du navigateur
            type: 'chromium',   // Type de navigateur : chromium, firefox, webkit
            launchOptions: {          // Options de lancement du navigateur
                args : ['--disable-crashpad', '--no-sandbox'], // Arguments supplémentaires pour le lancement du navigateur
                dataDir: 'C:\\K6-Formation', // Répertoire de données pour le navigateur (utile pour Windows)
            },    
            }   
        }
    }
  },
  thresholds: {
    checks: ['rate==1.0'],  // Seuils de réussite des vérifications
  },
};


/*
    Correspond a la partie E2E de mon script k6.
    C'est ici que l'on définit le parcour des actions à executer des utilisateurs virtuels (VUs) pendant le test.
    Chaque VU va exécuter cette fonction de manière indépendante.
*/
export default async function () {
  const page = await browser.newPage(); // Ouvre une nouvelle page dans le navigateur

  try {
    await page.goto('https://test.k6.io/'); // Navigue vers l'URL spécifiée
    console.log('titre de la page:', await page.title());   // Affiche le titre de la page dans la console
  } finally {
    await page.close();
  }
}