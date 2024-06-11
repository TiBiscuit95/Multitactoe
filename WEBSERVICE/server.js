require('dotenv').config();
const session = require('express-session');
const express = require('express');
const bcrypt = require('bcrypt');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
const app = express();
const connectionDB = require('./connectionDB');
const portWEB = 3000;
const path = require('path');
const genuuid = require('uuid').v4;
const cors = require('cors');

// Crée un store pour la session
const sessionStore = new MySQLStore({}, connectionDB);
// Cross-Origin Resource Sharing (CORS)
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' // Remplacer par l'origine de la page web
}));

// configuration de la session
app.use(session({
    // génère un nouvel identifiant de session
    genid: function(req) {
        return genuuid()
      },
      // Clé secrète pour la session
      secret: process.env.SESSION_SECRET,
        name: process.env.SESSION_NAME,
    // configuration du cookie
    cookie: {
        // durée de vie du cookie
        expires: 1000 * 60 * 60 * 2,
        secure: false,
        httpOnly: false,
        signed: true
    },
    // sauvegarde pas la session à chaque requête
    resave: false,
    // crée une nouvelle session si elle n'existe pas
    saveUninitialized: true,
    // store pour la session
    store: sessionStore,
    // ne crée pas de table dans base de données
    createDatabaseTable: false,
    // configuration de la table de session
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    },
}));

// Supprime les sessions expirées toutes les heures
setInterval(() => {
  sessionStore.clearExpiredSessions();
}, 1000 * 60 * 60);

// Parse URL-encoded bodies envoyés par le client
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies envoyés par le client
app.use(express.json());
 
// sert les fichiers statiques
app.use(express.static(path.join(__dirname, '..', 'WEBAPP')));
 
// Middleware pour protéger les routes
const protectionRoute = (req, res, next) => {
    if(!req.session.user) {
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
};

// Gestion d'erreur
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Route par défaut
app.get('/', (req, res) => {
    if(req.session.user) {
        res.status(201).send('User connected');
    } else {
      console.log(req.session); //debug
      res.status(401).send('Unauthorized');
    }
});
 
// Route pour la page d'accueil
app.post('/signup', async (req, res) => {
    // Récupère les valeurs des champs du formulaire
    const { e_mail, pseudo, password } = req.body;
    // Vérifie si l'utilisateur existe déjà
    connectionDB.query('SELECT * FROM joueur WHERE e_mail = ?', [e_mail], async (err, result) => {
        if (err){
            console.log(err);                                           // anciennement : if (err) throw err;    
            return res.status(500).send('Internal Server Error');       // anciennement : console.log('User online');
        }
        // Si l'utilisateur existe déjà, renvoie une erreur
        if(result.length > 0) {
            res.status(409).send('User already exists');
        // Sinon, crée un nouveau joueur
        } else {
            // Hash le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Insère les valeurs dans la base de données
            connectionDB.query('INSERT INTO joueur (pseudo, e_mail, password) VALUES (?, ?, ?)', [pseudo, e_mail, hashedPassword], (err) => {
                if (err){
                    console.log(err);                                           // anciennement : if (err) throw err;    
                    return res.status(500).send('Internal Server Error');       // anciennement : console.log('User online');
                }
                res.status(201).send('User created');
            });
        }
    });
});
 
// Route pour la connexion
app.post('/signin', async (req, res) => {
    // Récupère les valeurs des champs du formulaire
    const { pseudo, password } = req.body;
    // Vérifie si les champs ne sont pas vides
    if(pseudo && password) {
        // Vérifie si l'utilisateur existe
        connectionDB.query('SELECT * FROM joueur WHERE pseudo = ?', [pseudo], async (err, result) => {
            if (err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }                                                                            // anciennement: if (err) throw err;
            // Si l'utilisateur existe, vérifie le mot de passe
            if (result.length > 0) {
                // Compare le mot de passe hashé avec le mot de passe entré
                const user = result[0];
                const isMatch = await bcrypt.compare(password, user.password);
                // Si les mots de passe correspondent, connecte l'utilisateur
                if (isMatch) {
                    connectionDB.query('UPDATE joueur SET etat_actuel = ? WHERE pseudo = ?', ['online', pseudo], (err, result) => {
                        if (err){
                            console.log(err);                                           // anciennement : if (err) throw err;    
                            return res.status(500).send('Internal Server Error');       // anciennement : console.log('User online');
                        }
                    });
                    // Stocke l'identifiant de l'utilisateur dans la session
                    req.session.user = user.id_joueur;
                    req.session.pseudo = user.pseudo;
                    // Sauvegarde la session
                    req.session.save(() => {                                            // anciennement : req.session.save();
                        res.status(200).send('Authentification successful');            // anciennement : res.status(201).json({ redirect: 'http://localhost:3000/accueil.html' });
                    });// console.log('User connected');
                } else {
                    // Si les mots de passe ne correspondent pas, renvoie un code d'erreur
                    res.status(401).send('Invalide credentials');                       // anciennement : res.status(401).json({ redirect: 'http://localhost:3000/' });
                }
            } else {
               res.status(404).send('User not found')                                   // anciennement : res.status(404).json({ redirect: 'http://localhost:3000/' }); 
            }
        });
    }
});
 
// Route pour les statistiques affichée sur la page d'accueil
app.get('/stats', protectionRoute, (req, res) => {
    connectionDB.query('SELECT partie_jouee, partie_gagnee, match_nul, partie_perdue FROM joueur WHERE id_joueur = ?', [req.session.user], (err, result) => {
        if (err){
            console.log(err);                                           // anciennement : if (err) throw err;    
            res.status(500).send(err);                           // anciennement : console.log('User online');
        }else{
            const stats = result[0];
            res.status(201).json(stats);
        }
    });
});
 
// route pour récupérer le pseudo de l'utilisateur
app.get('/userinfo', protectionRoute, (req, res) => {
    // Simplement renvoyer le pseudo stocké dans la session
    res.status(201).json({ pseudo: req.session.pseudo });
});

// Route pour la page d'accueil
app.get('/retourAccueil', protectionRoute, (req, res, next) => {
    // Pas d'erreur à vérifier ici
    res.status(201).send('Redirected');
});

// Route pour la déconnexion
app.post('/signout', protectionRoute, (req, res) => {
    connectionDB.query('UPDATE joueur SET etat_actuel = ? WHERE id_joueur = ?', ['offline', req.session.user], (err) => {
        if (err){
            console.log(err);                                           // anciennement : if (err) throw err;
            res.status(500).send('Internal Server Error');
        }
    }),
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send('User disconnected');
        }
    });
});
 


// Connecte à la base de données
connectionDB.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});
// crée un serveur HTTP
const server = http.createServer(app);
// démarre le serveur sur le port 3000
server.listen(portWEB, () => {
    console.log('Server running on port 3000');
});

// path: WEBSERVICE/connectionDB.js

// npm install
// npm init -y
// npm install express
// npm install express-session
// npm install mysql
// npm install bcrypt
// npm install express-mysql-session
// npm install dotenv
// npm install cors
// npm install uuid

