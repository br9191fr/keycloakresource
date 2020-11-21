const express = require("express");
var router = express.Router()


router.get('/', function (req, res) {
    res.send('Resources Main Page');
})

router.get('/about', function (req, res) {
    res.send('About Resources Folder Page');
})


module.exports = router