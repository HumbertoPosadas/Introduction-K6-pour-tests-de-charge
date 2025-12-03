/*
    Exemple d'une charge progressive basique : augmentation progressive du nombre d'utilisateurs virtuels (VUs) sur une période donnée.
    L'execution de ce test se fait en plusieurs paliers (stages) pour simuler une montée en charge progressive.
    dans l'exemple ci-dessous, 4 paliers (iterations) sont définis :
    - 1ere iteration : monter à 20 VUs en 50 secondes
    - 2eme iteration : rester à 10 VUs pendant 30 minutes
    - 3eme iteration : descendre à 5 VUs en 20 secondes
    - 4eme iteration : rester à 0 VUs pendant 10 secondes
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause

export const options = {
    stages: [
        { duration: '50s', target: 20 }, // 1ere iteration : monter à 20 VUs en 50 secondes
        { duration: '30s', target: 10 },  // 2eme iteration : rester à 10 VUs pendant 30 secondes
        { duration: '20s', target: 5 },  // 3eme iteration : descendre à 5 VUs en 20 secondes
        { duration: '10s', target: 0 },   // 4eme iteration : rester à 0 VUs pendant 10 secondes
    ]
};

//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    http.get('https://test.k6.io/');
    sleep(1); // Pause de 1 seconde entre les requêtes
}