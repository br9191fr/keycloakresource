const express = require("express");
var router = express.Router()


router.get('/', function (req, res) {
    res.send('Resources Home Page');
})

router.get('/about', function (req, res) {
    res.send('About Resources Page');
})



module.exports = router