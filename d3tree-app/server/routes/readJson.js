var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.send(fs.readFileSync('./chart.json'));
});

module.exports = router;
