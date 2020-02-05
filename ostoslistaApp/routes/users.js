var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

ostoslista = []

//hakee api pixabaysta kuvan
router.route('/:hakusana')
  .get(function (req, res) {
    const haku = req.params.hakusana
    fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126&q=" + haku + "&image_type=illustration&lang=fi&category=food")
      .then(function (fetchres) {
        console.log(fetchres)
        //muuttaa jsoniksi
        return fetchres.json()
      })
      //lähettää kuvan localhostille selaimelle
      .then(function (data) {
        console.log(data)
        res.json(data)
        //lisää ostokset arrayhin palvelimelle ostokset.json 
        ostoslista.push(haku)
        console.log(ostoslista)
        fs.writeFile('ostokset.json', JSON.stringify(ostoslista), () => { console.log("Ostokset tallennettu") })
      })
  })

module.exports = router;