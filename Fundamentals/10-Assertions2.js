/*
    Cet classe de test illustre l'utilisation des métriques personnalisées dans K6, notamment Trend, Rate, Counter et Gauge.
    Un Trend (tendance) est une métrique qui enregistre des valeurs numériques et calcule des statistiques comme la moyenne, le minimum, le maximum, les percentiles, etc.
    Un Rate (taux) est une métrique qui enregistre le nombre de fois qu'un événement se produit par rapport au nombre total d'événements, exprimé en pourcentage.
    Un Counter (compteur) est une métrique qui enregistre un nombre cumulatif qui ne peut qu'augmenter, utile pour compter des événements.
    Un Gauge (jauge) est une métrique qui enregistre une valeur numérique qui peut augmenter ou diminuer, utile pour mesurer des valeurs comme la taille ou la charge.
    Dans cet exemple, nous allons créer des métriques personnalisées pour mesurer le temps de réponse (RTT), vérifier la présence de contenu spécifique dans la réponse, mesurer la taille de la réponse et compter les erreurs.
*/
import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause
import { parseHTML } from 'k6/html';    // Importation de la fonction pour analyser le HTML
import { Trend, Rate, Counter, Gauge } from 'k6/metrics'; // Importation de la classe Trend pour les métriques personnalisées


export const TrendRTT = new Trend('RTT'); // Création d'une métrique personnalisée pour le Round Trip Time (RTT)
export const RateContent = new Rate('ContentOK'); // Création d'une métrique personnalisée pour le taux de contenu correct
export const GaugeContentOK = new Gauge('ContentSize'); // Création d'une métrique personnalisée pour le gauge de contenu correct
export const CountersErrors = new Counter('Errors'); // Création d'une métrique personnalisée pour le compteur d'erreurs

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
        ],
        http_req_failed: ['rate<0.01'], // Le taux d'erreurs doit être inférieur à 1%
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
    const res = http.get('https://jsonplaceholder.typicode.com/users');

    // verifier si entre les 10 users qui composent le body de la reponse on arrive a trouver les strings suivants :
    const users = res.json();
    const hasClementine = users.some(user => user.name === 'Clementine Bauch');
    const hasSamantha = users.some(user => user.username === 'Samantha');
    const hasNathan = users.some(user => user.email === 'Nathan@yesenia.net');

    const contentOK = hasClementine && hasSamantha && hasNathan;
    

    TrendRTT.add(res.timings.duration); // Ajouter le temps de réponse total à la métrique RTT
    RateContent.add(contentOK); // Ajouter le résultat de la vérification du contenu à la métrique Content OK
    GaugeContentOK.add(res.body.length); // Ajouter la taille du corps de la réponse à la métrique Content size
    CountersErrors.add(!contentOK ? 1 : 0); // Incrémenter le compteur d'erreurs si le contenu n'est pas correct

}