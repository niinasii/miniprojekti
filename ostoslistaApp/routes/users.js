var express = require('express');
var router = express.Router();
//pitää olla fetch täällä
var fetch = require('node-fetch');

//hakee api musesta tiedot
<<<<<<< HEAD
router.route('/:hakusana')
=======
router.route('/:id')
>>>>>>> 44788e6e6cc3a16e0f7f3fac8a153ecbd2f8e78f
  .get(function (req, res) {
    const haku = req.params.hakusana
    fetch("https://pixabay.com/api/?key=15135527-ee5c1abe508d61f100ff75126&q=" + haku + "&image_type=photo")
      .then(function (fetchres) {
        console.log(fetchres)
        //console.log(res.json())
        //muuttaa jsoniksi?
        return fetchres.json()
      })
      //lähettää tiedot eteenpäin "takaisin päin" localhostille
      .then(function (data) {
        console.log(data)
        res.json(data)
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