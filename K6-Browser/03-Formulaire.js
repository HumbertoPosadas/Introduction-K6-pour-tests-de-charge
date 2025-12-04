/*
    ====================================================================
    USER STORY: Connexion utilisateur
    ====================================================================
    
    En tant qu'utilisateur enregistré,
    Je veux pouvoir me connecter avec mes identifiants,
    Afin d'accéder à mon profil et aux fonctionnalités personnalisées.
    
    CRITÈRES D'ACCEPTATION:
    - ✓ AC1: L'utilisateur peut cliquer sur le bouton "Login"
    - ✓ AC2: Le modal de connexion s'affiche correctement
    - ✓ AC3: L'utilisateur peut saisir son nom d'utilisateur
    - ✓ AC4: L'utilisateur peut saisir son mot de passe
    - ✓ AC5: L'utilisateur peut soumettre le formulaire
    - ✓ AC6: Après connexion réussie, le bouton "Logout" est visible
    - ✓ AC7: Un message de bienvenue personnalisé s'affiche
    
    RÈGLES MÉTIER:
    - Les identifiants doivent être corrects
    - La session utilisateur doit être créée
    - L'interface doit refléter l'état connecté
    
    ====================================================================
*/

import { browser } from "k6/browser";
import { check, sleep } from "k6";

export const options = {
    scenarios: {
        TextboxesScenario: {
            executor: 'shared-iterations',
            vus: 1, 
            iterations: 1,
            maxDuration: '10s',
            options: {
                browser: {
                    type: 'chromium',
                    headless: false,
                    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Chemin vers l'exécutable Chrome
                    args : [
                        '--disable-extensions',
                    ],
                    dataDir: 'C:\\K6-Formation\\K6-Browser\\UserData', // Répertoire de données pour le navigateur
                },
            }
        
        }    
    },
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
