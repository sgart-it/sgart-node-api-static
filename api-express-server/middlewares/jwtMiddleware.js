const jwt = require('jsonwebtoken');
const settings = require('../appsettings.json');
const authService = require('../services/authService');

//TODO: da ultimare e testare

const jwtMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            //const user = await jwt.verify(token, settings.jwt.secretKey);
            const user = authService.verifyJwtToken(token);

            req.user = user;

            next();
        } catch (error) {
            return res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};
/*
const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, settings.jwt.secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
*/
module.exports = jwtMiddleware;
