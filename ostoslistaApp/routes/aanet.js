var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.route('/').get(function (req, res, next) {
    let informaatiot = fs.readFileSync("ostokset.json");
    console.log(JSON.parse(informaatiot));
    ostoslista = JSON.parse(informaatiot);
    //  tämän pitäisi palauttaa olemassa olevan ostoslistan takaisin clientille - haeAanet() - jaska
    res.send(informaatiot);
})

module.exports = router;
