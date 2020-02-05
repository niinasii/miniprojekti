var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

ostoslista = []

router.route('/').get(function (req, res, next) { // tämän pitäisi palauttaa olemassa olevan ostoslistan käyttäjälle selaimen latautuessa - jaska
  res.json(ostokset.json);
})
//hakee api pixabaysta kuvan
router.route('/:hakusana').get(function (req, res) {
  const haku = req.params.hakusana
  fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126&q=" + haku + "&image_type=illustration&lang=fi&category=food")
    .then(function (fetchres) {
      // console.log(fetchres)
      //muuttaa jsoniksi
      return fetchres.json()
    })
    //lähettää kuvan localhostille selaimelle
    .then(function (data) {
      console.log(data)
      res.json(data)
    })
}) //lisää ostokset arrayhin palvelimelle ostokset.json 
  .post(function (req, res, next) {
    let tuote = req.body
    ostoslista.push(tuote)
    console.log(ostoslista)
    fs.writeFile('ostokset.json', JSON.stringify(ostoslista), () => { console.log("Ostokset tallennettu") })

  }).delete(function (req, res) {
    //poistaa ostoksen
    for (var o in ostokset) {
      if (ostokset[o].hakusana == req.body.hakusana) {
        ostokset.splice(o, 1);
        res.json("{msg: 'ostos poistettu'}");
        fs.writeFile("ostokset.json", JSON.stringify(ostokset), () => { console.log("Ostokset tallennettu") });
        return;
      }
      console.log(ostokset)
    }
    res.json("{'msg': 'Ostoslistalta ei löydy tätä tuotetta!'}");
  })
  .put(function (req, res, next) { // ensimmäinen versio PUT:sta, en tiedä toimiiko : D - jaska 
    let ostosind = ostoslista.findIndex(o => o.hakusana == req.params.hakusana);
    ostoslista[ostosind] = req.body
    res.json({ message: ostosind + " updated" });
  })

module.exports = router;