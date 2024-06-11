// Module pour la gestion des tokens d'autorisations
const jwt = require('jsonwebtoken');
//require('dotenv').config();
// Clé secrète pour la création des tokens
//require('dotenv').config();
const SECRET_KEY = 'wCVpc*1DPj'; // à mettre dans .env plus tard lors du déploiement
const REFRESH_SECRET_KEY = 'PfRE?56kJ'; // à mettre dans .env plus tard lors du déploiement  
// Fonction pour vérifier si le token est valide
function authenticateToken(req, res, next) {
    // récupère le token d'accès dans le cookie
    const cookies = req.cookies; // récupère les cookies
    const token = cookies.token; // récupère le token
    const refresh_token = cookies.refresh_token; // récupère le token de rafraîchissement

    if (!token) {
        res.sendStatus(401);
        res.clearcookie('token');
        res.redirect('../WEBAPP/public/index.html'); // si aucun token, renvoie 401
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Vérifie le token de rafraîchissement
            jwt.verify(refresh_token, REFRESH_SECRET_KEY, (err, user) => {
                if (!refresh_token) {
                    res.sendStatus(401);
                    res.clearcookie('token', 'refresh_token');
                    res.redirect('../WEBAPP/public/index.html');
                }
                if (err) {
                    res.sendStatus(401);
                    res.clearcookie('token', 'refresh_token')
                    res.redirect('../WEBAPP/public/index.html'); // Si le token de rafraîchissement est invalide, renvoie 403
                }
                // Si le token de rafraîchissement est valide, crée un nouveau token d'accès
                const token = jwt.sign({ id: user }, SECRET_KEY, { expiresIn: '30min' });
                // Envoie le nouveau token d'accès dans un cookie
                res.cookie('token', token, id.user, { httpOnly: true });
            });
        };
        req.user = user;
        next(); // passe à la prochaine fonction middleware
    });
}
 
// exporte le module
module.exports = authenticateToken;
// Path: WEBSERVICE/router.js