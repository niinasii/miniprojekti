var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');

ostoslista = []

router.route('/').get(function (req, res, next) {

  let informaatiot = fs.readFileSync("ostokset.json");
  console.log(JSON.parse(informaatiot));
  ostoslista = JSON.parse(informaatiot);
  //  tämän pitäisi palauttaa olemassa olevan ostoslistan käyttäjälle selaimen latautuessa - jaska
  res.send(informaatiot);


}).post(function (req, res, next) {
  let tuote = req.body
  ostoslista.push(tuote)
  console.log(ostoslista)
  fs.writeFile('ostokset.json', JSON.stringify(ostoslista), () => { console.log("Ostokset tallennettu") })
  res.json({ ostoslista })

}).delete(function (req, res) {
  //poistaa ostoksen
  console.log(req)
  for (var o in ostoslista) {
    console.log(req.body);
    if (ostoslista[o].hakusana == req.body.hakusana) {
      ostoslista.splice(o, 1);
      res.json("{msg: 'ostos poistettu'}");
      fs.writeFile("ostokset.json", JSON.stringify(ostoslista), () => { console.log("Ostokset tallennettu") });
      return;
    }
    console.log(ostoslista)
  }
  res.json("{'msg': 'Ostoslistalta ei löydy tätä tuotetta!'}");
})
  .put(function (req, res, next) { // muuttaa lukumäärää 
    console.log(req)
    for (var o in ostoslista) {
      console.log(req.body);
      if (ostoslista[o].hakusana == req.body.hakusana) {
        ostoslista.splice(o, 1); //poistaa tuotteen ja määrän
        let tuote = req.body;
        ostoslista.push(tuote); // lisää tuotteen uudella määrällä
        console.log(ostoslista)
        res.json("{msg: 'ostoksen määrä muutettu'}");
        fs.writeFile("ostokset.json", JSON.stringify(ostoslista), () => { console.log("Ostosten määrä muutettu") });
        return;
      }
      console.log(ostoslista)
    }
    res.json("{'msg': 'Ostoslistalta ei löydy tätä tuotetta!'}");
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
      // console.log(data)
      res.json(data)
    })})
    .get(function (req, res) {
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
}) //lisää ostokset arrayhin palvelimelle ostokset.json 


module.exports = router;