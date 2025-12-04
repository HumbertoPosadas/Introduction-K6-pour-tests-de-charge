import { check, sleep } from 'k6';
import { browser } from 'k6/experimental/browser'; // CORRECTION: experimental/browser

export const options = {
  scenarios: {
    scenario_name: {
      // ==================== EXECUTORS ====================
      executor: 'shared-iterations',  // REQUIS: shared-iterations, constant-vus, ramping-vus, per-vu-iterations, constant-arrival-rate, ramping-arrival-rate, externally-controlled
      
      // ==================== VUs & ITERATIONS ====================
      vus: 1,                    // Nombre d'utilisateurs virtuels
      // maxVUs: 10,             // Maximum de VUs (pour ramping-vus)
      iterations: 1,             // Nombre total d'itérations
      // duration: '30s',        // Durée du test (pour constant-vus)
      // maxDuration: '1m',      // Durée maximale autorisée
      
      // ==================== RAMPING (pour ramping-vus) ====================
      // startVUs: 0,            // VUs de départ
      // stages: [               // Paliers de montée/descente
      //   { duration: '10s', target: 5 },
      //   { duration: '20s', target: 10 },
      //   { duration: '10s', target: 0 },
      // ],
      
      // ==================== ARRIVAL RATE (pour arrival-rate executors) ====================
      // rate: 10,               // Nombre d'itérations par unité de temps
      // timeUnit: '1s',         // Unité de temps (1s, 1m, etc.)
      // preAllocatedVUs: 5,     // VUs pré-alloués
      
      // ==================== TIMING ====================
      // startTime: '10s',       // Délai avant de commencer
      // gracefulStop: '30s',    // Temps gracieux d'arrêt
      // gracefulRampDown: '30s', // Temps gracieux de descente
      
      // ==================== TAGS & ENV ====================
      // tags: {                 // Tags personnalisés pour ce scénario
      //   scenario_type: 'browser',
      //   test_phase: 'smoke',
      // },
      // env: {                  // Variables d'environnement spécifiques
      //   MY_VAR: 'value',
      // },
      
      // ==================== BROWSER OPTIONS ====================
      options: {
        browser: {
          type: 'chromium',      // REQUIS: chromium, firefox, webkit
          
          // ==================== DISPLAY OPTIONS ====================
          headless: true,        // Mode sans interface graphique
          // slowMo: 0,          // Ralentissement en ms entre les actions
          // devtools: false,    // Ouvrir les DevTools
          
          // ==================== LAUNCH OPTIONS ====================
          launchOptions: {
            // ========== GENERAL ==========
            // executablePath: '/path/to/chrome',  // Chemin vers l'exécutable du navigateur
            // channel: 'chrome',                   // Canal du navigateur (chrome, msedge)
            // ignoreDefaultArgs: false,            // Ignorer les arguments par défaut
            
            // ========== ARGUMENTS ==========
            args: [
              '--disable-web-security',          // Désactiver la sécurité web
              '--disable-features=VizDisplayCompositor',
              '--disable-crashpad',              // Désactiver le crash reporting
              '--no-sandbox',                    // Mode sans sandbox (nécessaire parfois)
              '--disable-setuid-sandbox',        // Désactiver setuid sandbox
              '--disable-dev-shm-usage',         // Éviter les problèmes de mémoire partagée
              '--disable-gpu',                   // Désactiver l'accélération GPU
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-renderer-backgrounding',
              '--disable-features=TranslateUI',
              '--disable-ipc-flooding-protection',
              // '--window-size=1920,1080',      // Taille de la fenêtre
              // '--start-maximized',            // Démarrer maximisé
              // '--incognito',                  // Mode incognito
              // '--disable-extensions',         // Désactiver les extensions
            ],
            
            // ========== PATHS & DIRECTORIES ==========
            // dataDir: 'C:\\K6-Formation\\browser-data', // Répertoire de données
            // downloadsPath: './downloads',              // Répertoire de téléchargements
            
            // ========== PROXY ==========
            // proxy: {
            //   server: 'http://proxy.company.com:8080',
            //   username: 'username',
            //   password: 'password',
            //   bypass: 'localhost,127.0.0.1',
            // },
            
            // ========== TIMEOUTS ==========
            // timeout: 30000,                   // Timeout global en ms
            
            // ========== DEBUGGING ==========
            // dumpio: false,                    // Rediriger stdout/stderr du navigateur
          },
          
          // ==================== PAGE OPTIONS ====================
          // contextOptions: {
          //   viewport: { width: 1920, height: 1080 },  // Taille du viewport
          //   userAgent: 'Custom User Agent',           // User agent personnalisé
          //   locale: 'fr-FR',                          // Locale
          //   timezoneId: 'Europe/Paris',               // Fuseau horaire
          //   geolocation: { latitude: 48.8566, longitude: 2.3522 }, // Géolocalisation
          //   permissions: ['geolocation'],             // Permissions
          //   colorScheme: 'dark',                      // Thème (light, dark, no-preference)
          //   extraHTTPHeaders: {                       // Headers HTTP supplémentaires
          //     'Accept-Language': 'fr-FR,fr;q=0.9',
          //   },
          //   httpCredentials: {                        // Authentification HTTP
          //     username: 'user',
          //     password: 'pass',
          //   },
          //   offline: false,                           // Mode hors ligne
          //   deviceScaleFactor: 1,                     // Facteur d'échelle
          //   isMobile: false,                          // Simulation mobile
          //   hasTouch: false,                          // Support tactile
          //   reducedMotion: 'no-preference',           // Mouvement réduit
          //   forcedColors: 'none',                     // Couleurs forcées
          // },
        },
      },
    },
  },
  
  // ==================== THRESHOLDS GLOBAUX ====================
  thresholds: {
    // Checks généraux
    checks: ['rate>=0.95'],                    // 95% des vérifications doivent passer
    
    // Métriques HTTP
    http_req_duration: ['p(95)<500'],          // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.05'],            // < 5% d'échecs
    
    // Métriques Browser spécifiques
    browser_web_vital_fcp: ['p(95)<2000'],     // First Contentful Paint < 2s
    browser_web_vital_lcp: ['p(95)<4000'],     // Largest Contentful Paint < 4s
    browser_web_vital_fid: ['p(95)<300'],      // First Input Delay < 300ms
    browser_web_vital_cls: ['p(95)<0.25'],     // Cumulative Layout Shift < 0.25
    browser_web_vital_ttfb: ['p(95)<1000'],    // Time to First Byte < 1s
    
    // Métriques par scénario
    // 'http_req_duration{scenario:scenario_name}': ['p(95)<1000'],
  },
  
  // ==================== OPTIONS GLOBALES ====================
  // userAgent: 'k6/0.47.0',           // User agent global
  // insecureSkipTLSVerify: false,     // Ignorer les erreurs TLS
  // noConnectionReuse: false,         // Désactiver la réutilisation des connexions
  // noVUConnectionReuse: false,       // Pas de réutilisation entre VUs
  // minIterationDuration: '1s',       // Durée minimale d'itération
  // setupTimeout: '60s',              // Timeout pour la fonction setup
  // teardownTimeout: '60s',           // Timeout pour la fonction teardown
  // rps: 100,                         // Limite de requêtes par seconde
  
  // ==================== OUTPUTS ====================
  // ext: {
  //   loadimpact: {
  //     projectID: 123456,
  //     name: "Mon test browser"
  //   }
  // }
};

export default async function () {
  const page = await browser.newPage();
  
  try {
    const response = await page.goto('https://test.k6.io/'); // Navigue vers l'URL spécifiée
    console.log('titre de la page:', await page.title());   // Affiche le titre de la page dans la console
    check(response,
      { 
        'page loaded': () => response.status() === 200,
        'Titre de la page est correct': ()=> page.title() === 'K6 Test Site',
    },  // Vérification simple pour s'assurer que la page a été chargée
    );
    await sleep(1); // Pause de 1 seconde pour simuler le temps de réflexion de l'utilisateur
  } finally {
    await page.close();
  }
}