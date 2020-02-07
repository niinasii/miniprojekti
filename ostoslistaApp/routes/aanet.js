var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

/* GET home page. */
router.route('/').get(function (req, res, next) { 
    let informaatiot = fs.readFileSync("ostokset.json"); //hakee tiedot ostokset.json tiedostosta
    console.log(JSON.parse(informaatiot));
    ostoslista = JSON.parse(informaatiot); //muuttaa js olioksi
    //  tämä palauttaa olemassa olevan ostoslistan takaisin clientille
    res.send(informaatiot);
})

module.exports = router;
