/*
    L'objectif de cette classe est de montrer comment créer des métriques personnalisées dans K6.
    Les métriques personnalisées permettent de suivre des aspects spécifiques des performances de l'application testée.
    Ici, nous allons créer des métriques pour différents timings de la requête HTTP.
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
const bloque = new Trend('Bloque'); // Création d'une métrique personnalisée pour le temps bloqué. Attention au nommage de la nouvelle metrique (pas d'espace, pas de caractères spéciaux)
const connexion = new Trend('Connexion'); // Création d'une métrique personnalisée pour le temps de connexion. Attention au nommage de la nouvelle metrique (pas d'espace, pas de caractères spéciaux)
const envoyes = new Trend('Envoye'); // Création d'une métrique personnalisée pour le temps d'envoi. Attention au nommage de la nouvelle metrique (pas d'espace, pas de caractères spéciaux)
const recus = new Trend('Recus'); // Création d'une métrique personnalisée pour le temps de réception. Attention au nommage de la nouvelle metrique (pas d'espace, pas de caractères spéciaux)

// Les métriques personnalisées vont s'afficher dans les résultats du test avec les autres métriques par défaut sous le titre CUSTOM


//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    temps_attente.add(res.timings.waiting); // Ajout du temps d'attente de la réponse HTTP à la métrique personnalisée
    bloque.add(res.timings.blocked); // Ajout du temps bloqué de la réponse HTTP à la métrique personnalisée
    connexion.add(res.timings.connecting); // Ajout du temps de connexion de la réponse HTTP à la métrique personnalisée
    envoyes.add(res.timings.sending); // Ajout du temps d'envoi de la réponse HTTP à la métrique personnalisée
    recus.add(res.timings.receiving); // Ajout du temps de réception de la réponse HTTP à la métrique personnalisée

    console.log(temps_attente); // Affiche le corps de la réponse dans la console
    console.log(bloque); // Affiche le corps de la réponse dans la console
    console.log(connexion); // Affiche le corps de la réponse dans la console
    console.log(envoyes); // Affiche le corps de la réponse dans la console
    console.log(recus); // Affiche le corps de la réponse dans la console

/* 
Exemple d'affichage dans la terminal
█ TOTAL RESULTS

    CUSTOM
    Bloque.........................: avg=207.6417 min=207.6417 med=207.6417 max=207.6417 p(90)=207.6417 p(95)=207.6417
    Connexion......................: avg=93.4697  min=93.4697  med=93.4697  max=93.4697  p(90)=93.4697  p(95)=93.4697
    Envoye.........................: avg=0        min=0        med=0        max=0        p(90)=0        p(95)=0
    Recus..........................: avg=0        min=0        med=0        max=0        p(90)=0        p(95)=0
    Temps_Attente..................: avg=98.4227  min=98.4227  med=98.4227  max=98.4227  p(90)=98.4227  p(95)=98.4227

    HTTP
    http_req_duration..............: avg=55.35ms  min=12.29ms  med=55.35ms  max=98.42ms  p(90)=89.8ms   p(95)=94.11ms
      { expected_response:true }...: avg=55.35ms  min=12.29ms  med=55.35ms  max=98.42ms  p(90)=89.8ms   p(95)=94.11ms
    http_req_failed................: 0.00%  0 out of 2
    http_reqs......................: 2      1.372213/s

    EXECUTION
    iteration_duration.............: avg=1.45s    min=1.45s    med=1.45s    max=1.45s    p(90)=1.45s    p(95)=1.45s
    iterations.....................: 1      0.686106/s
    vus............................: 1      min=1      max=1
    vus_max........................: 1      min=1      max=1

    NETWORK
    data_received..................: 14 kB  9.4 kB/s
    data_sent......................: 3.6 kB 2.4 kB/s
*/
    sleep(1); // Pause de 1 seconde entre les requêtes
}