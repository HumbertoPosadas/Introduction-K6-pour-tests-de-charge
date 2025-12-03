/*
    L'objectif de cette classe est de montrer comment utiliser les seuils (thresholds) dans K6.
    Les seuils permettent de définir des critères de réussite ou d'échec pour les tests de performance.
    La definitions de seuils se passe par la section "thresholds" dans les options de test.
    Ici, nous allons définir un seuil pour la durée des requêtes HTTP et d'autres paramètres de charge progressive.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause
import { parseHTML } from 'k6/html';    // Importation de la fonction pour analyser le HTML


// Définition des options de test avec des seuils et des étapes de charge progressive
export const options = {
    stages: [
        { duration: '10s', target: 20 }, // 1ere iteration : monter à 20 VUs en 50 secondes
        { duration: '5s', target: 10 },  // 2eme iteration : rester à 10 VUs pendant 30 secondes
    ],
    thresholds: {
        http_req_duration: [
            'p(80) < 100',   // 80% des requêtes doivent être en dessous de 100ms
            'p(90) < 105',   // 90% des requêtes doivent être en dessous de 102ms
            'p(95) < 108',   // 95% des requêtes doivent être en dessous de 104ms
            'min < 8',       // Le temps minimum des requêtes doit être en dessous de 8ms
        ]
    },
};

//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    const doc = parseHTML(res.body); //definition de la reponse en HTML pour pouvoir l'analyser

    check(res, {
        'Status 200': (r) => r.status === 200,
        'Contains QuickPizza': (r) => r.body.includes('QuickPizza'),
        'temps de reponse < 200ms': (r) => r.timings.duration < 200,
        'Temps d\'attente < 100ms': (r) => r.timings.waiting < 100,
        'Temps d\'envoi < 50ms': (r) => r.timings.sending < 50,
        'Temps de reception < 50ms': (r) => r.timings.receiving < 50,
        'Body contients la balise Title et le contenu QuickPizza': (r) => {
            return doc.find('title').text() === 'QuickPizza'
        }
    });


    sleep(1); // Pause de 1 seconde entre les requêtes
}
/*
A la fin les resultats afficheront si les seuils ont été respectés ou non, les lignes concernées seront marquées en vert (respecté) ou en rouge (non respecté).
 Exemple echec de seuil :
 THRESHOLDS

    http_req_duration
    ✗ 'p(80) < 100' p(80)=100.14ms
    ✗ 'p(90) < 102' p(90)=102.44ms
    ✓ 'p(95) < 104' p(95)=103.54ms
    ✓ 'min < 8' min=6.74ms

ERRO[0016] thresholds on metrics 'http_req_duration' have been crossed

//affichage assertions
    ✓ Status 200
    ✓ Contains QuickPizza
    ✗ temps de reponse < 200ms
      ↳  93% — ✓ 152 / ✗ 11
    ✗ Temps d'attente < 100ms
      ↳  25% — ✓ 42 / ✗ 121
    ✓ Temps d'envoi < 50ms
    ✓ Temps de reception < 50ms
    ✓ Body contients la balise Title et le contenu QuickPizza
*/