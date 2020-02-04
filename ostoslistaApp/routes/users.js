var express = require('express');
var router = express.Router();
//pitää olla fetch täällä
var fetch = require('node-fetch');

//hakee api musesta tiedot
router.route('/:hakusana')
  .get(function (req, res) {
    const haku = req.params.hakusana
    fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126&q=" + haku + "&image_type=photo")
      .then(function (fetchres) {
        console.log(fetchres)
        //console.log(res.json())
        //muuttaa jsoniksi?
        return fetchres.json()
      })
      //lähettää kuvan localhostille selaimelle
      .then(function (data) {
        console.log(data)
        res.json(data)
        fs.writeFile('ostokset.json', JSON.stringify(req.body), () => { console.log("Ostokset tallennettu") })
      })
  })
router.post('/', function (req, res, next) {
  console.log("post pyyntö laitettu");
  console.dir(req.body);
  // var ostos = req.body;
  // ostoslista.push(henkilo);
  // console.dir(henkilolista);
  fs.writeFile('ostokset.json', JSON.stringify(req.body), () => { console.log("Ostokset tallennettu") })
  // res.render('kuittaus', { title: 'kiitos, '+henkilo.name });
  // res.send(`<h1>Post: Henkilon tiedot: ${req.body.name}, ${req.body.email}, ${req.body.gender}.<h1>`);
  // res.render('lomake', { title: 'lomake', vastaanotettu: `Kiitos!<br>Nimi: ${req.body.name}<br>s-posti: ${req.body.email}<br>Sukupuoli: ${req.body.gender}` });
})


module.exports = router;