/*
    L'objectif de cette classe est de servir de template pour la création de nouveaux scripts de test de performance avec K6.
    Elle inclut les imports nécessaires, une structure de base pour les tests, et des exemples de commandes pour exécuter les tests.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause
import { Trend } from 'k6/metrics'; // Importation de la classe Trend pour les métriques personnalisées


// Définition des options basiques de test. Il est important que le nom soit "options" pour que K6 le reconnaisse.
// Un VU (Virtual User) représente un utilisateur virtuel simulé par K6 pendant le test de charge.
// Le but de cette constante est de définir un nombre fixe d'utilisateurs virtuels et une durée fixe pour le test.
export const options = {
    vus: 1,           // Nombre d'utilisateurs virtuels
    duration: '1s',  // Durée totale du test
};

const temps_attente = new Trend('Temps_Attente'); // Création d'une métrique personnalisée pour le temps d'attente. Attention au nommage de la nouvelle metrique (pas d'espace, pas de caractères spéciaux)
// La metrique personalisée va s'afficher dans les résultats du test avec les autres métriques par défaut sous le titre CUSTOM


//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    temps_attente.add(res.timings.waiting); // Ajout du temps d'attente de la réponse HTTP à la métrique personnalisée
    console.log(temps_attente); // Affiche le corps de la réponse dans la console

/* 
Exemple d'affichage dans la terminal
█ TOTAL RESULTS

    CUSTOM
    Temps_Attente..................: avg=101.9217 min=101.9217 med=101.9217 max=101.9217 p(90)=101.9217 p(95)=101.9217 <------------------------ métrique personnalisée

    HTTP
    http_req_duration..............: avg=56.04ms  min=8.96ms   med=56.04ms  max=103.13ms p(90)=93.71ms  p(95)=98.42ms
      { expected_response:true }...: avg=56.04ms  min=8.96ms   med=56.04ms  max=103.13ms p(90)=93.71ms  p(95)=98.42ms
    http_req_failed................: 0.00%  0 out of 2
    http_reqs......................: 2      1.352717/s

    EXECUTION
    iteration_duration.............: avg=1.47s    min=1.47s    med=1.47s    max=1.47s    p(90)=1.47s    p(95)=1.47s
    iterations.....................: 1      0.676359/s
    vus............................: 1      min=1      max=1
    vus_max........................: 1      min=1      max=1

    NETWORK
    data_received..................: 14 kB  9.2 kB/s
    data_sent......................: 3.6 kB 2.4 kB/s
*/
    sleep(1); // Pause de 1 seconde entre les requêtes
}