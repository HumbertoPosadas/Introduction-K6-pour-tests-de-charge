/*
    classe qui permet d'utiliser un objet modele de scenarios importé dans un script k6 browser.
*/
import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { scenarioObjectModel } from "./04-ScenarioObject.js";

//definbition des scenarios en utilisant l'objet modele importé
export const options = {
    scenarios: Object.assign(
        scenarioObjectModel('ScenarioOne', 1, 1, '10s'),
        scenarioObjectModel('ScenarioTwo', 5, 5, '15s'),
        scenarioObjectModel('ScenarioThree', 10, 10, '20s'),
        scenarioObjectModel('ScenarioFour', 2, 2, '5s'),
),
    thresholds: {
        checks: ['rate==1.0'],
        },
};  

export default async function() {
    const page = await browser.newPage();
    const username = 'HPO';
    const password = 'Pa$$w0rd';
    const userInputSelector = '//*[@id="loginusername"]';       // XPath pour le champ utilisateur
    const passwordInputSelector = '//*[@id="loginpassword"]';   // XPath pour le champ mot de passe
    const loginButtonSelector = '//*[@id="logInModal"]/div/div/div[3]/button[2]'; // XPath pour le bouton de connexion

    try {
        // naviguer vers la page
        const response = await page.goto('https://www.demoblaze.com/');
        console.log('titre de la page : ' + await page.title());

        // une fois que la page est chargée, cliquer sur le bouton "Login"
        await page.click('#login2');        // Selecteur par ID
        console.log('Bouton Login cliqué');

        // attendre que le modal de login soit visible, recherche de l'elemtnt par ID
        await page.waitForSelector('#logInModal', { timeout: 5000, visible: true });       // WaitForSelector va attendre que l'élément soit présent et visible pendant un maximum de 5 secondes, si pas de timeout defini alors 30s par defaut. L'attriut visible: true garantit que l'élément est visible à l'utilisateur.    
        console.log('Modal de login visible');

        // remplir les champs de texte
        await page.type(userInputSelector, username);   // Selecteur par ID 
        await page.type(passwordInputSelector, password);    // Selecteur par ID
        console.log('Champs de texte remplis');
        sleep(1); // Pause de 1 seconde pour simuler le temps de réflexion de l'utilisateur

        // soumettre le formulaire de login
        await page.click(loginButtonSelector); // Selecteur combiné
        console.log('Formulaire de login soumis');
        await page.waitForTimeout(2000); // Attendre 2 secondes pour le traitement du login

        // vérifier que le login a réussi en vérifiant la présence du bouton "Logout" et du message de bienvenue
        const logoutButton = await page.$('#logout2'); // Selecteur par ID
        check(logoutButton, {
            'Login réussi, bouton Logout présent': (btn) => btn !== null,
            'Mention Welcome username s\'affiche': page.content().then(content => content.includes('Welcome ' + username)),
            },
        );
} 
catch (error) {
        console.error('Erreur lors du test de connexion :', error);
    }
finally {
        await page.close();
    }
}
