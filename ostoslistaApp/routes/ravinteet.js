var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

router.route('/:hakusana').get(function (req, res) {
        const haku = req.params.hakusana
        fetch("https://fineli.fi/fineli/api/v1/foods?q=" + haku)
          .then(function (fetchres) {
            // console.log(fetchres)
            //muuttaa jsoniksi
            return fetchres.json()
          })
          //lähettää kuvan localhostille selaimelle
          .then(function (data) {
            // console.log(data)
            res.json(data)
          })
  })

  module.exports = router;