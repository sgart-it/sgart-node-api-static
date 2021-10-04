const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const settings = require('./appsettings.json');
const jwtAuth = require('./middlewares/jwtMiddleware');

/**
 * routing definition
 */
const demoRouter = require('./routes/demoRoute');
const authRouter = require('./routes/authRoute');
const secureRouter = require('./routes/secureRoute');

/**
 * espress configuration
 */
const app = express();

app.use(logger('dev'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));


/* con questo abilito CORS su tutto, 
 * non serve aggiungerlo sulle singole route (cors())
 * non serve app.options('*', cors());
 */ 
app.use(cors({
    origin: settings.cors.origin,   // deve coincidere con la url del dominio chiamante senza slash finale
    allowedHeaders: settings.cors.allowedHeaders,
    methods: settings.cors.methods,
    maxAge: settings.cors.maxAge
}));

app.use('/demo', demoRouter);
app.use('/auth', authRouter);
app.use('/secure', jwtAuth, secureRouter);


module.exports = app;
