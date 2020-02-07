var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

router.route('/:hakusana').get(function (req, res) { //lähettää pyynnön Fineli rest apiin
        const haku = req.params.hakusana
        fetch("https://fineli.fi/fineli/api/v1/foods?q=" + haku) // hakee hakusanalla tuotekategorian ravintosisällöt
          .then(function (fetchres) {
            //muuttaa jsoniksi
            return fetchres.json()
          })
          .then(function (data) { //lähettää datan selaimelle
            res.json(data)
          })
  })

  module.exports = router;