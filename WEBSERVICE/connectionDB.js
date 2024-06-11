// Module pour la gestion des requêtes SQL à la DB
const MySQL = require('mysql2');
const portDB = 3306;
// Crée la connection à la base de données
const connectionDB = MySQL.createConnection({// Adresse du serveur, ici localhost mais à changer plus tard lors du déploiement
    host: portDB,                           
      user: 'App',                    // Nom d'utilisateur !!!!! à changer avec vos identifiants mysql
      password: 'White!Rabbit',       // Mot de passe !!!!! à changer avec vos identifiants mysql
      database: 'morpion'
});
// exporte le module
module.exports = connectionDB;
// Path: WEBSERVICE/server.js

// MySQL en local
// need mysql server running
// create database and tables
// create .env file with the following content:
// SESSION_SECRET=secret
// SESSION_NAME=express-session
// DB_HOST
// DB_USER
// DB_PASSWORD
// DB_DATABASE
// DB_PORT

