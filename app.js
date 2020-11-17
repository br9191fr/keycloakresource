const express = require("express");
const cors = require('cors');
const app = express();
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require('fs');


app.use(cors({
  origin: 'http://localhost:8080'
}));

function base64urlDecode(str) {
  return Buffer.from(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}

let memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const ckConfig = {
  clientId: "vueclient",
  bearerOnly: true,
  serverUrl: "http://localhost:8180/auth",
  realm: "AuthSrvTest",
  "enable-cors": true
};

let keycloak = new Keycloak({store: memoryStore}, ckConfig);

let lastToken = {};

app.use( keycloak.middleware() );

let displayToken = function(req, res) {
  let auth = req.headers['authorization'];
  let cert = fs.readFileSync('cert.txt');
  if (auth && auth.toLowerCase().indexOf('bearer') === 0) {
    
    let inToken = auth.slice('bearer '.length);
    console.log(inToken);
    res.json({"bearer": inToken});
  }
  else if (lastToken !== {}) {
    let tokenInfo = "i am Empty"
    jwt.verify(lastToken,cert,'RS256',function(err,verifiedJwt){
      if(err){
        console.log('Err:\n'+err);
        tokenInfo = {"Error" : err}
      }
      else{
        // verifiedJwt will contain the payload of the jwt
        console.log('Token is OK');

        const segments = lastToken.split('.');

        const headerSeg = segments[0];
        const payloadSeg = segments[1];
        const signatureSeg = segments[2];
        const h = JSON.parse(base64urlDecode(headerSeg));
        const p = JSON.parse(base64urlDecode(payloadSeg));

        const data = {
          header: h,
          payload: p,
          signature: signatureSeg
        }
        console.log('scope1 => \n'+data.payload.scope);
        console.log('token :\n'+verifiedJwt);


        let decoded = jwt.decode(lastToken);
        console.log('decoded => '+decoded.aud);

        console.log('decoded1 => '+verifiedJwt.aud);

        tokenInfo = data
      }
    });
    res.json(tokenInfo);
  }
  else {
    res.json({"Error": "??"});
  }  
}

let displayFruit =  function(req, res) {
  let inToken = null;
  let auth = req.headers['authorization'];
  if (auth && auth.toLowerCase().indexOf('bearer') === 0) {

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
