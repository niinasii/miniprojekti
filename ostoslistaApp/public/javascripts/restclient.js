const hakubtn = document.querySelector("#lisaa");
const tallennusbtn = document.querySelector("#tallennus");
const ravinteetbtn = document.querySelector("#ravinteet");
const hakusana = document.querySelector("#hakusana"); //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
const maara = document.querySelector("#maara");
class Tuote {
    constructor(hakusana, maara) {
        this.hakusana = hakusana;
        this.maara = maara;
    }
}

function yliviivaus() {
    let nappi = this;
    let ostos = nappi.parentElement;
    ostos.classList.toggle("yliviivaus"); // Lisää listaelementille luokan yliviivaus -otto
    nappi.innerText === "Peruuta" ? nappi.innerText = "Kerätty" : nappi.innerText = "Peruuta"; //vaihtaa napin tekstin
}

function poista() {
    //kaikki tämä regex-hulluus johtuu siitä, että listaelementin sisältöön kuuluu muutakin, kuin ostoksen nimi. älä kysy. -otto
    let nappi = this;
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let regex = /^[A-Z]+/i;
    let ostos = listateksti.match(regex);
    ostos = ostos[0];
    ostos = ostos.substring(0, ostos.length);

    let ostosolio = new Tuote(ostos, 0);

    // luodaan DELETE -fetch-pyyntö. 
    fetch("http://localhost:3000/api/users/", {
         //pitääkö olla await???? -otto
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ostosolio)
    })
        .then(response => response.json())
        .then(data => console.log("poisto onnistunut, vastaus: " + data));

    listaelementti.remove(); //poistaa listaelementin, jonka lapsena poista-nappi on.
}

function muokkaa() {
    //haetaan tuotteen nimi ja tallennetaan se muuttujaan "ostos"
    let nappi = this;
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let ostosregex = /^[A-Z]+/i;
    let ostos = listateksti.match(ostosregex);
    ostos = ostos[0];
    ostos = ostos.substring(0, ostos.length);

    //luodaan muokkauskenttä
    let muokkaakentta = document.createElement("input");
    muokkaakentta.setAttribute("type", "text");
    muokkaakentta.setAttribute("id", "muokkaakentta");

    listaelementti.appendChild(muokkaakentta);

    //luodaan muokkauskentän tallennuspainike
    let tallennusnappi = document.createElement("button");
    tallennusnappi.setAttribute("type", "button");
    tallennusnappi.setAttribute("id", "tallennusnappi");
    tallennusnappi.innerText = "Päivitä";

    listaelementti.appendChild(tallennusnappi);

    tallennusnappi.addEventListener("click", paivita);


    function paivita() {    //kirjoitetaan put-pyyntö
        let uusimaara = muokkaakentta.value;
        let paivitys = new Tuote(ostos, uusimaara);
        fetch("http://localhost:3000/api/users/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paivitys)
        })
            .then(response => response.json())

        listaelementti.remove();
        lisääListalle(ostos, uusimaara);
    }
}
function lähetys() {

    let ostos = new Tuote(hakusana.value, maara.value);

    fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ostos)
    })
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                lisääListalle(data[i].hakusana, data[i].maara);
            }
        })
    lisääListalle(hakusana.value, maara.value);
}
//hakee palvelimelle tallenetun json muotoisen ostoslistan
function listaus() {
    fetch("http://localhost:3000/api/users")
        .then(vastaus => vastaus.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                lisääListalle(data[i].hakusana, data[i].maara);
            }
        })
}

function lisääListalle(hakusana, maara) {
    let lista = document.querySelector('#lista'); //luo muuttujan valitsemastaan html-dokumentin elementistä
    let ostos = document.createElement('li'); //luodaan uusi lista-elementti
    ostos.innerHTML = `${hakusana} x ${maara} `; //asetetaan lista-elementin arvoksi käyttjän syöttämä hakusana ja määrä
    let nappitehty = document.createElement('button'); // uusi muuttuja & luodaan samalla html-elementti
    nappitehty.innerText = "Kerätty"; //napin tekstiksi Tehty
    let nappipoista = document.createElement('button'); //uusi muuttuja & luodaan samalla html-elementti
    nappipoista.innerText = "Poista"; //napin tekstiksi Poista
    let nappimuokkaa = document.createElement("button");
    nappimuokkaa.innerText = "Muokkaa määrää"
    ostos.appendChild(nappitehty); //lisätään ostos-html elementiin nappitehty
    ostos.appendChild(nappipoista); //listään ostos-html elementiin nappipoista
    ostos.appendChild(nappimuokkaa); //lisätään ostos-elementille nappi muokkaa
    lista.appendChild(ostos); //julkaistaan koko höskä

    nappitehty.addEventListener('click', yliviivaus); //lisätään napille toiminto "yliviivaus"
    nappipoista.addEventListener('click', poista); // lisätään napille toiminto "poista"
    nappimuokkaa.addEventListener("click", muokkaa);

    //annetaan napeille vielä id:t -otto
    nappitehty.classList.add("nappitehty");
    nappipoista.classList.add("nappipoista");
    nappimuokkaa.classList.add("nappimuokkaa");

    //lähetetään jsoniin
    let tallennus = new Tuote(hakusana, maara);
    // lähetys(tallennus);
}

function hae() {
    fetch("http://localhost:3000/api/users/" + hakusana.value)
        .then(vastaus => vastaus.json())
        .then(data => {
            // data pitää sisällään 20 eri ruokakuvavaihtoehtoa.
            let url = data.hits[0].largeImageURL;  //poimitaan vastausdatasta kuvan url-osoite ja asetetaan se muutujan url arvoksi.
            document.getElementById("tuotekuva").src = url; //vaihdetaan kuvaelementin src-attribuutiksi datasta haettu url.
        })
    // lisääListalle(hakusana.value, maara.value);
}

function haeRavinteet() {

    fetch("http://localhost:3000/api/ravinteet/" + hakusana.value)
        .then(vastaus => vastaus.json())
        .then(data => {
            console.log(data)
            for (let d of data) {
                ravinteetdiv.innerHTML = `Tuote on ${d.name}`
                
        }
})}


hakubtn.addEventListener("click", hae);
tallennusbtn.addEventListener("click", lähetys);
window.addEventListener("DOMContentLoaded", listaus);
ravinteetbtn.addEventListener("click", haeRavinteet);
