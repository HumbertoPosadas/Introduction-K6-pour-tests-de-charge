/*
    Cette classe a pour objectif de montrer comment structurer des tests de performance en utilisant des groupes (groups) dans K6.
    Les groupes permettent de regrouper logiquement des ensembles de vérifications (checks) et d'actions similaires, facilitant ainsi la lecture et l'organisation des scripts de test.
    De plus, cette classe illustre l'utilisation de métriques personnalisées (custom metrics) pour suivre des indicateurs spécifiques tels que le temps de réponse (RTT), le taux de contenu correct, la taille du contenu et le nombre d'erreurs.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, group, sleep } from 'k6'; // Importation des fonctions de vérification et de pause
import { parseHTML } from 'k6/html';    // Importation de la fonction pour analyser le HTML
import { Trend, Rate, Counter, Gauge } from 'k6/metrics'; // Importation de la classe Trend pour les métriques personnalisées


export const TrendRTT = new Trend('RTT'); // Création d'une métrique personnalisée pour le Round Trip Time (RTT)
export const RateContent = new Rate('ContentOK'); // Création d'une métrique personnalisée pour le taux de contenu correct
export const GaugeContentOK = new Gauge('ContentSize'); // Création d'une métrique personnalisée pour le gauge de contenu correct
export const CountersErrors = new Counter('Errors'); // Création d'une métrique personnalisée pour le compteur d'erreurs

export const options = {
    stages: [
        { duration: '5s', target: 1 },  // 2eme iteration : rester à 10 VUs pendant 30 secondes
    ],
    thresholds: {
        http_req_duration: [
            'p(80) < 100',   // 80% des requêtes doivent être en dessous de 100ms
            'p(90) < 105',   // 90% des requêtes doivent être en dessous de 102ms
            'p(95) < 108',   // 95% des requêtes doivent être en dessous de 104ms
            'min < 8',       // Le temps minimum des requêtes doit être en dessous de 8ms
        ],
        http_req_failed: ['rate>0.03'], // Le taux d'erreurs doit être inférieur à 3%
        http_req_waiting: ['p(90)<200'], // 90% des temps d'attente doivent être en dessous de 200ms
        'RTT': [
            'p(90) < 150',
            'p(95) < 200',
            'avg < 100',
            'med < 80',
            'min < 50',
        ], // 90% des RTT doivent être en dessous de 150ms
        'ContentOK': ['rate>0.95'], // 95% des contenus doivent être corrects
        'ContentSize': ['value<2000'], // La taille moyenne du contenu doit être inférieure à 2000 caractères
        'Errors': ['count < 5'], // Le nombre total d'erreurs doit être inférieur à 5
    },
};

export default function () {
    const res = http.get('https://jsonplaceholder.typicode.com/');
    const doc = parseHTML(res.body)
    
    console.log(res.status);

    group('Verifications de état et contenu de la reponse', function () {
        check(res, {'La page à chargé correctement': (r) => r.status === 200});
        
        if(res.status !== 304){
            check(res, {
                'Verifier le titre de la page <title>JSONPlaceholder - Free Fake REST API</title>': (r) => doc.find('title').text() === 'JSONPlaceholder - Free Fake REST API',
                'Verifier la presence de la balise h1 avec le contenu JSONPlaceholder': (r) => doc.find('h1').text() === 'JSONPlaceholder',
                'Verifier la presence de la balise meta description avec le contenu Fake Online REST API for Testing and Prototyping.': (r) => doc.find('meta[name="description"]').attr('content') === 'Fake Online REST API for Testing and Prototyping.',
                'La taille de la page est inferieure à 3000 caractères': (r) => r.body.length < 3000
            }); 
        } 
    });

    group('Verification sur la performance du Response', function () {
        if(res.body.length > 0){
            check(res, {
                'La page a chargé en moins de 200ms': (r) => r.timings.duration < 200,
                'Temps d\'attente < 100ms': (r) => r.timings.waiting < 100,
                'Temps d\'envoi < 50ms': (r) => r.timings.sending < 50,
                'Temps de reception < 50ms': (r) => r.timings.receiving < 50,
                'RTT < 150ms': (r) => r.timings.duration < 150,
                'Temps d\'attente < 200ms': (r) => r.timings.waiting < 200,
            });
        } else {
            console.log('Le body de la reponse est vide, les checks de performance sont ignorés.');
        }
    });

    group('Verifications de taille de la reponse', function () {
        if(res.body.length < 2000){
            check(res, {
                'La taille de la page est inferieure à 2000 caractères': (r) => r.body.length < 2000,
            });
        }
        else if(res.body.length > 2000){
            check(res, {
                'La taille de la page est inferieure à 10000 caractères': (r) => r.body.length < 10000,
                'La taille totale de la reponse est inferieure à 35000 caractères': (r) => (r.body.length + r.headers.length) < 35000,
            });
        }

        if(res.headers.length < 5000){
            check(res, {
                'La taille des headers est inferieure à 5000 caractères': (r) => r.headers.length < 5000,
            });
        }else if(res.headers.length > 5000){
            check(res, {
                'La taille des headers est inferieure à 10000 caractères': (r) => r.headers.length < 10000,
            });
        }
    });
    sleep(1);
}

/*
Affichage en terminal des resultats des groupes et des checks :


*/