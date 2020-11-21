const express = require("express");
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
let mustacheExpress = require('mustache-express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

const resources = require('./routes/resources')
const api = require('./api')

const app = express();
app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


let memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

const ckConfig = {
    clientId: "vueclient1",
    bearerOnly: true,
    serverUrl: "http://localhost:8180/auth",
    realm: "AuthSrvTest",
    "enable-cors": true
};

let keycloak = new Keycloak({store: memoryStore}, ckConfig);

let displayHello = function (req, res) {
    res.render('hello', {title: "Accueil SrvTest", msg: "Bienvenue"})
}
app.get('/', displayHello);

/** ----------------------------------- **/
app.use(keycloak.middleware());
app.use('/resources', resources)
app.get('/show', api.displayToken);
app.get('/fruit', keycloak.protect(), api.displayFruit);
app.get('/subscriber-orig', keycloak.protect(), api.displaySubscriber);
app.get('/subscriber', keycloak.protect('data_access'), api.displaySubscriber);
/** ----------------------------------- **/

// does not work <= not allowed bad role
//app.get('/subscriber', keycloak.protect('data_access1'),displaySubscriber);

// does work <= allowed good role
//app.get('/subscriber', keycloak.protect('vueclient1:data_access'),displaySubscriber);

// does work <= allowed for bruno,vueclient1
//app.get('/subscriber', keycloak.protect('testrole'),displaySubscriber);

// does work <= allowed for bruno,vueclient1
// does not work <= not allowed for bricci
//app.get('/subscriber', keycloak.protect('realm:testrole1'),displaySubscriber);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
