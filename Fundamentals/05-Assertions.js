/*
    L'objectif de cette classe est de servir de template pour la création de nouveaux scripts de test de performance avec K6.
    Elle inclut les imports nécessaires, une structure de base pour les tests, et des exemples de commandes pour exécuter les tests.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause
import { parseHTML } from 'k6/html';

/*
export const options = {
    stages: [
        { duration: '20s', target: 5 },  // 3eme iteration : descendre à 0 VUs en 30 secondes
        { duration: '10s', target: 0 },   // 4eme iteration : rester à 0 VUs pendant 10 secondes
    ]
};
*/
export const options = {
    vus: 1,           // Nombre d'utilisateurs virtuels
    duration: '5s',  // Durée totale du test
};


//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    const doc = parseHTML(res.body); //definition de la reponse en HTML pour pouvoir l'analyser
    
    //pour afficher le contenu du corps de la réponse dans la console 

    console.log('=== BODY HTML COMPLET ===');
    console.log(res.body);
    
    // Pour voir des éléments spécifiques
    console.log('=== ÉLÉMENTS EXTRAITS ===');
    console.log('Titre:', doc.find('title').text());
    console.log('Premier H1:', doc.find('h1').first().text());
        
    // Headers de la réponse
    console.log('=== HEADERS ===');
    console.log(JSON.stringify(res.headers, null, 2));
    
    // Infos sur la réponse
    console.log('=== INFOS RÉPONSE ===');
    console.log('Status:', res.status);
    console.log('URL finale:', res.url);
    console.log('Taille body:', res.body.length, 'caractères');
    
    /*
    // Assertions 
    check(res, {'La page a chargé correctement': (r) => r.status == 200}); // si le statut est 200, le test passe et le message s'affiche
    check(res, {'Validation titre affiché dans la page': (r) => r.body.includes('QuickPizza')}) // vérifie que le corps de la réponse contient le texte spécifié (titre de la page)
    check(res, {'verifier la presence de la balise html Titre avec le contenu QuickPizza': (r) => {
        return doc.find('title').text() === 'QuickPizza'
    }}) // vérifie que la balise title contient le texte spécifié
    check(res, {'La taille de la page est inferieure à 3000 caractères': (r) => r.body.length < 3000}) // vérifie que la taille de la page est inferieure à 3000 caractères
    check(res,{'La page a chargé en moins de 200ms': (r) => r.timings.duration < 200}) // vérifie que le temps de chargement est inferieur à 200ms
    check(res,{'Redirection vers quickpizza OK': (r) => r.url == 'https://quickpizza.grafana.com/'} ) // vérifie que l'url de la page est correcte
    */

    //Assertions format compact
    check(res, {
        'La page a chargé correctement': (r) => r.status == 200,
        'Validation titre affiché dans la page': (r) => r.body.includes('QuickPizza'),
        'verifier la presence de la balise html Titre avec le contenu QuickPizza': (r) => doc.find('title').text() === 'QuickPizza',
        'La taille de la page est inferieure à 3000 caractères': (r) => r.body.length < 3000,
        'La page a chargé en moins de 200ms': (r) => r.timings.duration < 200,
        'Redirection vers quickpizza OK': (r) => r.url == 'https://quickpizza.grafana.com/'
    });
    sleep(1); // Pause de 1 seconde entre les requêtes
}