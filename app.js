var express = require("express");
var cors = require('cors');
var app = express();
var Keycloak = require('keycloak-connect');
var session = require('express-session');
const parseJson = require('parse-json');
const base64url = require('base64-url')
var jwt = require('jsonwebtoken');
var fs = require('fs');
var nJwt = require('njwt');

app.use(cors({
  origin: 'http://localhost:8080'
}));

function base64urlDecode(str) {
  return Buffer.from(base64urlUnescape(str), 'base64').toString();
};

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

var ckConfig = {
  clientId: "vueclient",
  bearerOnly: true,
  serverUrl: "http://localhost:8180/auth",
  realm: "AuthSrvTest",
  "enable-cors": true
};

var keycloak = new Keycloak({store: memoryStore},ckConfig);

var lastToken = {};

app.use( keycloak.middleware() );

var displayToken = function(req, res, next) {
  var auth = req.headers['authorization'];
  var pubKey = fs.readFileSync('pubKey.txt');
  var cert = fs.readFileSync('cert.txt');
  if (auth && auth.toLowerCase().indexOf('bearer') == 0) {
    
    inToken = auth.slice('bearer '.length);
    console.log(inToken);
    res.json({"data": "Empty"});
  }
  else if (lastToken !== {}) {
    //console.log("LastToken is "+lastToken);
    var tokenInfo = "i am Empty"
    jwt.verify(lastToken,cert,'RS256',function(err,verifiedJwt){ // was nJWt
      if(err){
        console.log('Err:\n'+err);
        tokenInfo = err
      }
      else{
        console.log("Token is OK"); // Will contain the header and body
        console.log("Checked Token is :\n"+verifiedJwt)
        var segments = lastToken.split('.');
        var headerSeg = segments[0];
        var payloadSeg = segments[1];
        var signatureSeg = segments[2];
        var h = JSON.parse(base64urlDecode(headerSeg));
        var p = JSON.parse(base64urlDecode(payloadSeg));

        var data = {
          header: h,
          payload: p,
          signature: signatureSeg
        }
        console.log('h => \n'+h);
        console.log('p => \n'+p);
        console.log('data => \n'+data);


        tokenInfo = jwt.decode(verifiedJwt)
        var decoded = jwt.decode(lastToken);
        console.log('decoded => '+decoded.aud);
        var decoded1 = jwt.decode(verifiedJwt);
        console.log('decoded1 => '+decoded.aud);


        res.json(data); // was         res.json(decoded)
        //res.json(verifiedJwt);
      }
    });
  }
  else {
    res.json({"data": "Empty"});
  }  
}

var displayFruit =  function(req, res, next) {
  var inToken = null;
  var auth = req.headers['authorization'];
  if (auth && auth.toLowerCase().indexOf('bearer') == 0) {

    inToken = auth.slice('bearer '.length);

    lastToken = inToken;
  }
  res.json(["Apple","Pear","Grape","Orange","Other"]);
}

app.get('/fruit', keycloak.protect(),displayFruit);
app.get('/show', displayToken);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
