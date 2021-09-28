const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const settings = require('./appsettings.json');

/**
 * routing definition
 */
const demoRouter = require('./routes/demo');
//var usersRouter = require('./routes/users');

/**
 * espress configuration
 */
const app = express();

app.use(cors({
    origin: settings.cors.origin,   // deve coincidere con la url del dominio chiamante senza slash finale
    allowedHeaders: settings.cors.allowedHeaders,
    methods: settings.cors.methods,
    maxAge: settings.cors.maxAge
}));

app.use(logger('dev'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/demo', demoRouter);
//app.use('/users', usersRouter);

module.exports = app;
