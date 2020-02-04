var express = require('express');
var router = express.Router();
//pitää olla fetch täällä
var fetch = require('node-fetch');

//hakee api musesta tiedot
router.route('/kuvahaku/:id')
  .get(function (req, res) {
    // res.send('respond with a resource');
    fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126=" + req.params.hakusana)
      .then(function (res) {
        //muuttaa jsoniksi?
        return res.json()
      })
      //lähettää tiedot eteenpäin "takaisin päin" localhostille
      .then(function (data) {
        console.log(data)
        res.json(data)
      })
  });

module.exports = router;