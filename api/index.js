const fs = require('fs');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
let lastToken = {};
let collectedData = {};

module.exports = {
    setPostData: function (req, res) {
        let info = req.body.info;
        let origin = req.body.origin;
        let add = {}

        collectedData = {
            info : info,
            origin : origin,
            verify : true
        };
        if (req.body.add != undefined) { collectedData.other = JSON.parse(req.body.add); }
        res.json(collectedData);
    },
    getPostData: function (req, res) {
        let result = collectedData;
        let answer = {
            result : result,
            other : 'Nothing'
        }
        if (req.query === undefined)
            console.log("query is undefined");
        else if (req.query === {})
            console.log("query is {}");
        else {
            console.log("query is ok");
            console.log ("what =>" + req.query.what);
            console.log ("why =>" + req.query.why);
            console.log ("query =>" + JSON.stringify(req.query));
            for (var key in req.query) {
                if (req.query.hasOwnProperty(key)) {
                    /* useful code here */
                    console.log("Found "+key+" =>"+req.query[key]);
                }
            }
        }
        if (req.query !== undefined && req.query !== {}) console.log("query =>"+req.query);
        if (collectedData !== {} && collectedData.other !== undefined) {
            // console.log('collectedData =>'+JSON.stringify(collectedData));
            let other = collectedData.other;
            if (other !== undefined && other !== {}) {
                console.log("other is not empty");
                let elts = {};
                if (other.elt1 !== {}) { elts.elt1 = other.elt1;  }
                if (other.elt2 !== {}) { elts.elt2 = other.elt2;  }
                if (elts !== {}) answer.elts_checked = elts;
            }
        }

        res.json(answer);
    },
    displayFruit: function (req, res) {
        let inToken = null;
        let auth = req.headers['authorization'];
        if (auth && auth.toLowerCase().indexOf('bearer') === 0) {
            inToken = auth.slice('bearer '.length);
            lastToken = inToken;
        }
        let result = ["Apple", "Pear", "Grape", "Orange", "Other","Nothing"];
        res.json(result);
    },
    displayToken: function (req, res) {
        let auth = req.headers['authorization'];
        let cert = fs.readFileSync('cert.txt');
        if (auth && auth.toLowerCase().indexOf('bearer') === 0) {
            let inToken = auth.slice('bearer '.length);
            console.log(inToken);
            res.json({"bearer": inToken});
        } else if (lastToken !== {}) {
            let tokenInfo = "i am Empty"
            jwt.verify(lastToken, cert, 'RS256', function (err, verifiedJwt) {
                if (err) {
                    console.log('Err:\n' + err);
                    tokenInfo = {"Error": err}
                } else {
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
                    console.log('In displayToken scope: ' + data.payload.scope);
                    console.log('In displayToken audience: ' + verifiedJwt.aud);
                    console.log('In displayToken authorized party: ' + verifiedJwt.azp);

                    tokenInfo = data
                }
            });
            res.json(tokenInfo);
        } else {
            res.json({"Error": "??"});
        }
    },
    displaySubscriberId: function (req, res) {
        let auth = req.headers['authorization'];
        let token = auth.slice('bearer '.length);
        let decode = jwt.decode(token);
        let subscriber = decode.sub;
        let expires_in = decode.exp;

        let exp = new Date(expires_in * 1000).toISOString().substr(11, 8);
        let result = {"subscriber": subscriber};
        res.json(result);
    },
    displaySubscriber: function (req, res) {
        let auth = req.headers['authorization'];
        let token = auth.slice('bearer '.length);
        let decode = jwt.decode(token);
        let subscriber = decode.sub;
        let expires_in = decode.exp;

        let exp = new Date(expires_in * 1000).toISOString().substr(11, 8);
        let result = {"subscriber": subscriber};
        console.log('In Display Subscriber subscriber: ' + result.subscriber);
        console.log('In Display Subscriber expires at: ' + exp);
        res.json(result);
    }
}