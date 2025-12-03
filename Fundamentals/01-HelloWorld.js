/*
    script de tests pour faire des requetes et verifications sur le endpoint proposé par K6
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause

//création de la classe de test
export default function () {

    // Effectuer une requête GET vers l'URL spécifiée
    let res = http.get('https://test.k6.io');
    sleep(1); // Pause de 1 seconde entre les requêtes
}


// commande pour lancer le test : k6 run 01-HelloWorld.js
// commande pour rajouter des VU directement depuis la console : k6 run --vus 10 --duration 30s 01-HelloWorld.js
// commande pour lancer un test avec un ramp-up et un ramp-down : k6 run --vus 10 --duration 1m30s 01-HelloWorld.js
