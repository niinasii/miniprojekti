var express = require('express');
var router = express.Router();
//pitää olla fetch täällä
var fetch = require('node-fetch');
let fs = require('fs')

ostoslista = [];

router.get('/', function(req, res, next) { // tämän pitäisi palauttaa olemassa olevan ostoslistan käyttäjälle selaimen latautuessa - jaska
  res.json(ostokset.json);

}
//hakee api musesta tiedot
router.route('/:hakusana') 
  .get(function (req, res) {
    const haku = req.params.hakusana
    ostoslista.push(haku);
    console.log(ostoslista)
    fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126&q=" + haku + "&image_type=illustration&lang=fi&category=food")
      .then(function (fetchres) {
        return fetchres.json()
      })
      //lähettää kuvan localhostiin selaimelle
      .then(function (data) {
        // console.log(data)
        res.json(data)
        fs.writeFile('ostokset.json', JSON.stringify(ostoslista), () => { console.log("Ostokset tallennettu") })
      })
  })

  router.put('/', function(req, res, next){ // ensimmäinen versio PUT:sta, en tiedä toimiiko : D - jaska 
    let ostosind=ostoslista.findIndex(o=>o.hakusana==req.params.hakusana);
    ostoslista[ostosind]=req.body
    res.json({message:ostosind+ " updated"});
})

// router.post('/', function (req, res, next) {
//   console.log("post pyyntö laitettu");
//   console.dir(req.body);
//   // var ostos = req.body;
//   // ostoslista.push(henkilo);
//   // console.dir(henkilolista);
//   fs.writeFile('ostokset.json', JSON.stringify(req.body), () => { console.log("Ostokset tallennettu") })
//   // res.render('kuittaus', { title: 'kiitos, '+henkilo.name });
//   // res.send(`<h1>Post: Henkilon tiedot: ${req.body.name}, ${req.body.email}, ${req.body.gender}.<h1>`);
//   // res.render('lomake', { title: 'lomake', vastaanotettu: `Kiitos!<br>Nimi: ${req.body.name}<br>s-posti: ${req.body.email}<br>Sukupuoli: ${req.body.gender}` });
// })


module.exports = router;