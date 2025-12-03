/*
    L'objectif de cette classe est de servir de template pour la création de nouveaux scripts de test de performance avec K6.
    Elle inclut les imports nécessaires, une structure de base pour les tests, et des exemples de commandes pour exécuter les tests.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause

/*
// Définition des options basiques de test. Il est important que le nom soit "options" pour que K6 le reconnaisse.
// Un VU (Virtual User) représente un utilisateur virtuel simulé par K6 pendant le test de charge.
// Le but de cette constante est de définir un nombre fixe d'utilisateurs virtuels et une durée fixe pour le test.
export const options = {
    vus: 1,           // Nombre d'utilisateurs virtuels
    duration: '',  // Durée totale du test
};
*/

// Définition des options avancés de test. Il est important que le nom soit "options" pour que K6 le reconnaisse.
// target : nombre de VUs à atteindre. cette constante est dediée aux tests avec des paliers (stages)
//un stage est défini par une durée et un nombre cible de VUs afin de simuler une montée en charge progressive
export const options = {
    stages: [
        { duration: '50s', target: 20 }, // 1ere iteration : monter à 10 VUs en 30 secondes
        { duration: '30m', target: 10 },  // 2eme iteration : rester à 10 VUs pendant 1 minute
        { duration: '20s', target: 5 },  // 3eme iteration : descendre à 0 VUs en 30 secondes
        { duration: '10s', target: 0 },   // 4eme iteration : rester à 0 VUs pendant 10 secondes
    ]
};

//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    //check(res, {'Validation texte affiché dans la page': (r) => r.body.includes('Looking to break out of your pizza routine?')}) // vérifie que le corps de la réponse contient le texte spécifié
    console.log('Body reçu : ' + res.body); // Affiche le corps de la réponse dans la console
    sleep(1); // Pause de 1 seconde entre les requêtes
}