var express = require('express');
var router = express.Router();
//pitää olla fetch täällä
var fetch = require('node-fetch');

//hakee api musesta tiedot
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
      .post('/', function (req, res, next) {
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
  });

module.exports = router;