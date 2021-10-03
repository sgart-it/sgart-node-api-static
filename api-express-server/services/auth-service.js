const jwt = require('jsonwebtoken');
const settings = require('../appsettings.json');

/* nel caso reale lo storage sarà su db con la password NON salvata in chiaro ma come HASH */
const userStorage = [
    { id: 1, userName: "user1", fullName: "Utente 1", password: "pwd1", email: "user1@sgart.local", roles: ["user", "admin"] },
    { id: 2, userName: "user2", fullName: "Utente 2", password: "pwd2", email: "user2@sgart.local", roles: ["user"] },
    { id: 3, userName: "user3", fullName: "Utente 3", password: "pwd3", email: "user3@sgart.local", roles: ["admin"] }
];

/**
 * valida le credenziali dell'utente e se valide ritorna un oggetto user
 * oppure null se non valide
 * @param {string} userName 
 * @param {string} password 
 * @returns {object} user
 */
function validateCredential(userName, password) {

    const u = userStorage.find(x => x.userName === userName && x.password === password);

    if (u === undefined)
        return null;

    return {
        id: u.id,
        userName: u.userName,
        fullName: u.fullName,
        email: u.email,
        roles: u.roles
    };
}

/**
 * genera il token JWT con i dati dell'utente
 * @param {object} user 
 * @returns {string} token
 */
function generateJwtToken(user) {
    console.log('generate token')

    const payload = {
        unique_name: user.userName,
        email: user.email,
        name: user.fullName,
        roles: user.roles
    };

    const options = {
        algorithm: 'HS256',
        jwtid: user.id.toString(),
        expiresIn: settings.jwt.expireMinutes * 60,
        issuer: settings.jwt.issuer,
        audience: settings.jwt.audience
    };

    const token = jwt.sign(payload, settings.jwt.secretKey, options);

    return token;
}

const service = {};


/**
 * ritorna il token JWT con i dati utente
 * @param {string} userName 
 * @param {string} password 
 * @returns {string} token JWT
 */
service.getJwtToken = function (userName, password) {
    console.log('get token', userName);

    if (userName === undefined || userName === null || userName === ''
        || password === undefined || password === null || password === '')
        return null;

    const user = validateCredential(userName, password);

    if (user === null)
        return null;

    return generateJwtToken(user);
};


module.exports = service;