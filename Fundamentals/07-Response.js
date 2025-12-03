/*
    L'objectif de cette classe est d'expliquer comment récupérer et afficher les différentes propriétés d'une réponse HTTP dans K6.
    Elle inclut les imports nécessaires, une structure de base pour les tests, et des exemples de commandes pour exécuter les tests.
*/

import http from 'k6/http';     // Importation du module HTTP de K6
import { check, sleep } from 'k6'; // Importation des fonctions de vérification et de pause


// Définition des options basiques de test. Il est important que le nom soit "options" pour que K6 le reconnaisse.
// Un VU (Virtual User) représente un utilisateur virtuel simulé par K6 pendant le test de charge.
// Le but de cette constante est de définir un nombre fixe d'utilisateurs virtuels et une durée fixe pour le test.
export const options = {
    vus: 1,           // Nombre d'utilisateurs virtuels
    duration: '1s',  // Durée totale du test
};




//création de la classe de test
export default function () {
    // Effectuer une requête GET vers l'URL spécifiée
    const res = http.get('https://test.k6.io/');
    console.log('-------------------------- Types de response -----------------------------'); // Affiche le corps de la réponse dans la console
    console.log('Status: ' + res.status);
    console.log('Headers: ' + JSON.stringify(res.headers));
    console.log('Body: ' + res.body);
    console.log('Response URL : ' +  res.request.url);
    console.log('Response methode : ' +  res.request.method);
    console.log('Response status text : ' +  res.status_text);
    console.log('Response Http blocked : ' +  res.timings.blocked);
    console.log('Response Http Connectivité : ' +  res.timings.connecting);
    console.log('Response Http Sending : ' +  res.timings.sending);
    console.log('Response Http Waiting : ' +  res.timings.waiting);
    console.log('Response Http Receiving : ' +  res.timings.receiving);
    console.log('Response Http Duration : ' +  res.timings.duration);
    console.log('Response Cookies : ' +  JSON.stringify(res.cookies));
    console.log('Response Error : ' +  res.error_code);
    console.log('Response Error_code : ' +  res.error_code);
    console.log('Response Ip remote : ' +  res.remote_ip);
    console.log('Response Port remote : ' +  res.remote_port);

/* 
Exemple d'affichage dans la terminal
INFO[0000] -------------------------- Types de response -----------------------------  source=console
INFO[0000] Status: 200  
*
*
*
INFO[0000] Response URL : https://test.k6.io/            source=console
INFO[0000] Response methode : GET                        source=console
INFO[0000] Response status text : 200 OK                 source=console
INFO[0000] Response Http blocked : 261.0215              source=console
INFO[0000] Response Http Connectivité : 122.1261         source=console
INFO[0000] Response Http Sending : 0.5209                source=console
INFO[0000] Response Http Waiting : 93.4134               source=console
INFO[0000] Response Http Receiving : 0                   source=console
INFO[0000] Response Http Duration : 93.9343              source=console
INFO[0000] Response Cookies : {"AWSALBCORS":[{"name":"AWSALBCORS","value":"FcookAoP74H/46ogMzUx5/7oN422EFk3L7GPd7JxyWwe0jAFb4NN8s7/lqwvfkscWZAFf9RzlEb4i33sYCxjU7sRazA9rCVgq9w9l4ymKYtH/MjMMsLovlTqD6Nu","domain":"","path":"/","http_only":false,"secure":true,"max_age":0,"expires":1764867272000}],"AWSALB":[{"name":"AWSALB","value":"FcookAoP74H/46ogMzUx5/7oN422EFk3L7GPd7JxyWwe0jAFb4NN8s7/lqwvfkscWZAFf9RzlEb4i33sYCxjU7sRazA9rCVgq9w9l4ymKYtH/MjMMsLovlTqD6Nu","domain":"","path":"/","http_only":false,"secure":false,"max_age":0,"expires":1764867272000}]}  source=console
INFO[0000] Response Error : 0                            source=console
INFO[0000] Response Error_code : 0                       source=console
INFO[0000] Response Ip remote : 3.141.180.83             source=console
INFO[0000] Response Port remote : 443                    source=console
*/
    sleep(1); // Pause de 1 seconde entre les requêtes
}