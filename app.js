const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const User = require('./server/models').User;

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'My session secret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionid',
    cookie: {
        path: '/api/accounts'
    }
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.uuid);
});

passport.deserializeUser(function (id, done) {
    User.findOne({
        where: {
            uuid: id
        }
    })
        .then(user => done(null, user))
        .catch(error => done(error, null))
});


//Connect to database
const models = require("./server/models");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database: films-dev');
})
    .catch(err => {
        console.error('Unable to connect to SQL database: films-dev', err);
    });

// CORS
app.disable('x-powered-by');
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
    message: 'Films API.',
}));

module.exports = app;