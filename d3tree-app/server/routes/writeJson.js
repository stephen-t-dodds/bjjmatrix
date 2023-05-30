var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res, next) {
  fs.writeFileSync('./chart.json', JSON.stringify(req.body.data), (err) => {
    if (err) {
      console.log(err);
    }
  });
});

module.exports = router;
