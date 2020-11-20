const fs = require('fs');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
let lastToken = {};

module.exports = {
    displayFruit: function(req, res) {
        let inToken = null;
        let auth = req.headers['authorization'];
        if (auth && auth.toLowerCase().indexOf('bearer') === 0) {

            inToken = auth.slice('bearer '.length);

            lastToken = inToken;
        }
        let result = ["Apple","Pear","Grape","Orange","Other"];
        res.json(result);
    },
    displayToken: function(req, res) {
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
                console.log('In displayToken: Token is OK');
                //console.log('In displayToken : Last Token =>\n'+JSON.stringify(jwt.decode(lastToken)));
                //console.log('In displayToken : Verified Token =>\n'+JSON.stringify(verifiedJwt));
                const segments = lastToken.split('.');

                const headerSeg = segments[0];
                const payloadSeg = segments[1];
                const signatureSeg = segments[2];
                const h = JSON.parse(utils.base64urlDecode(headerSeg));
                const p = JSON.parse(utils.base64urlDecode(payloadSeg));

                const data = {
                    header: h,
                    payload: p,
                    signature: signatureSeg
                }
                console.log('In displayToken scope: '+data.payload.scope);
                console.log('In displayToken audience: '+verifiedJwt.aud);
                console.log('In displayToken authorized party: '+verifiedJwt.azp);

                tokenInfo = data
            }
        });
        res.json(tokenInfo);
    }
    else {
        res.json({"Error": "??"});
    }
},
    displaySubscriberId: function(req,res) {
    let auth = req.headers['authorization'];
    let token = auth.slice('bearer '.length);
    let decode = jwt.decode(token);
    let subscriber = decode.sub;
    let expires_in = decode.exp;

    let exp = new Date(expires_in * 1000).toISOString().substr(11, 8);
    let result = {"subscriber" : subscriber};
    res.json(result);
},
    displaySubscriber: function(req,res) {
    let auth = req.headers['authorization'];
    let token = auth.slice('bearer '.length);
    let decode = jwt.decode(token);
    let subscriber = decode.sub;
    let expires_in = decode.exp;

    let exp = new Date(expires_in * 1000).toISOString().substr(11, 8);
    let result = {"subscriber" : subscriber};
    console.log('In Display Subscriber subscriber: '+result.subscriber);
    console.log('In Display Subscriber expires at: '+exp);
    res.json(result);
}
}