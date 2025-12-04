/*
    Modele d'objet scenario k6 browser.
*/


export function scenarioObjectModel(scenarioName, vus, iterations, maxDuration){
    return {
        [scenarioName] : {                     // Nom du scénario fourni en paramètre
            executor: 'shared-iterations',    // Type d'exécuteur defini pour l'ensemble des scenarios k6 browser
            vus: vus,                           // Nombre d'utilisateurs virtuels (VUs) fourni en paramètre
            iterations: iterations,             // Nombre total d'itérations à exécuter fourni en paramètre
            maxDuration: maxDuration,           // Durée maximale d'exécution du scénario fournie en paramètre
            options: {                     // Options spécifiques à l'exécuteur
                browser: {                 // Configuration du navigateur
                type: 'chromium',   // Type de navigateur : chromium, firefox, webkit
                launchOptions: {          // Options de lancement du navigateur
                    headless: false,     // Exécution en mode headless (sans interface graphique)
                    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Chemin vers l'exécutable Chrome
                    args : [
                        '--disable-extensions',
                        '--no-sandbox',
                    ],
                    dataDir: 'C:\\K6-Formation\\K6-Browser\\UserData', // Répertoire de données pour le navigateur
                },
          }},
        }
    };
}