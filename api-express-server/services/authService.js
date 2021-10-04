const jwt = require('jsonwebtoken');
const settings = require('../appsettings.json');

/* nel caso reale lo storage sarà su db con la password NON salvata in chiaro ma come HASH */
const userStorage = [
    { id: 1, username: "user1", fullName: "Utente 1", password: "pwd1", email: "user1@sgart.local", roles: ["user", "admin"] },
    { id: 2, username: "user2", fullName: "Utente 2", password: "pwd2", email: "user2@sgart.local", roles: ["user"] },
    { id: 3, username: "user3", fullName: "Utente 3", password: "pwd3", email: "user3@sgart.local", roles: ["admin"] }
];

const getJwtOptions = (id) => {
    const options = {
        algorithm: 'HS256',
        expiresIn: settings.jwt.expireMinutes * 60,
        issuer: settings.jwt.issuer,
        audience: settings.jwt.audience
    };

    if (id) {
        options.jwtid = id;
    }

    return options;
};

/**
 * valida le credenziali dell'utente e se valide ritorna un oggetto user
 * oppure null se non valide
 * @param {string} username 
 * @param {string} password 
 * @returns {object} user
 */
const validateCredential = (username, password) => {

    const u = userStorage.find(x => x.username === username && x.password === password);

    if (u === undefined)
        return null;

    return {
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        roles: u.roles
    };
};

/**
 * genera il token JWT con i dati dell'utente
 * @param {object} user 
 * @returns {string} token
 */
function generateJwtToken(user) {
    console.log('generate token')

    const payload = {
        unique_name: user.username,
        email: user.email,
        name: user.fullName,
        roles: user.roles
    };

    const token = jwt.sign(payload, settings.jwt.secretKey, getJwtOptions(user.id.toString()));

    return token;
}

const service = {};


/**
 * ritorna il token JWT con i dati utente
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token JWT
 */
service.getJwtToken = (username, password) => {
    console.log('getJwtToken', username);

    if (username === undefined || username === null || username === ''
        || password === undefined || password === null || password === '')
        return null;

    console.log('getJwtToken validate');
    const user = validateCredential(username, password);

    if (user === null)
        return null;

    return generateJwtToken(user);
};

service.verifyJwtToken = (token) => {
    console.log('verifyJwtToken');

    if (token === undefined || token === null || token === '')
        return false;

    const user = jwt.verify(token, 
            settings.jwt.secretKey, 
            getJwtOptions());

    return user != null;
};

module.exports = service;