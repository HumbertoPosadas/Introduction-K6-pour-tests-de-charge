/*
    Exemple d'une charge classique fixe basique : un nombre fixe d'utilisateurs virtuels (VUs) pendant une durée fixe.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause

export const options = {
    vus: 20,           // Nombre d'utilisateurs virtuels
    duration: '30s',  // Durée totale du test
};


//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    http.get('https://test.k6.io/users');
    sleep(1); // Pause de 1 seconde entre les requêtes
}