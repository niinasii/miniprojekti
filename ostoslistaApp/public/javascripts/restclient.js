const hakubtn = document.querySelector("#lisaa");

class Tuote{
    constructor(hakusana, maara) {
        this.hakusana = hakusana;
        this.maara = maara;
    }
}

function yliviivaus() {
    let nappi = this;
    let ostos = nappi.parentElement;
    ostos.classList.toggle("yliviivaus"); // Lisää listaelementille luokan yliviivaus -otto
    nappi.innerText = "Peruuta"; //vaihtaa napin tekstin
}

function poista() {
    //kaikki tämä regex-hulluus johtuu siitä, että listaelementin sisältöön kuuluu muutakin, kuin ostoksen nimi. älä kysy. -otto
    let nappi = this;
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let regex = /^[A-Z ]+/i;
    let ostos = listateksti.match(regex);
    ostos = ostos[0];
    ostos = ostos.substring(0, ostos.length - 1);
    console.log(ostos);

    // luodaan DELETE -fetch-pyyntö. 
    fetch("http://localhost:3000/api/users/", { //pitääkö olla await???? -otto
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ostos)
    })
        .then(response => response.json())
        .then(data => console.log("poisto onnistunut, vastaus: " + data));

    listaelementti.remove(); //poistaa listaelementin, jonka lapsena poista-nappi on.
}

function muokkaa() {
    alert("ei vielä implementoitu. sori.");
}

function lähetys(tallennus) {
    fetch("http://localhost:3000/api/users/",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(tallennus)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            lisääListalle(data[i].hakusana, data[i].maara);
        }
    })
}

//hakee palvelimelle tallenetun json muotoisen ostoslistan
function listaus() {
    fetch("http://localhost:3000/api/users/")
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
    nappitehty.innerText = "Tehty"; //napin tekstiksi Tehty
    let nappipoista = document.createElement('button'); //uusi muuttuja & luodaan samalla html-elementti
    nappipoista.innerText = "Poista"; //napin tekstiksi Poista
    let nappimuokkaa = document.createElement("button");
    nappimuokkaa.innerText = "Muokkaa"
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
    lähetys(tallennus);
}

function hae() {
    const hakusana = document.querySelector("#hakusana").value; //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
    const maara = document.querySelector("#maara").value;

    fetch("http://localhost:3000/api/users/" + hakusana)
        .then(vastaus => vastaus.json())
        .then(data => {
            // data pitää sisällään 20 eri ruokakuvavaihtoehtoa.
            console.log(data);
            let url = data.hits[0].largeImageURL;  //poimitaan vastausdatasta kuvan url-osoite ja asetetaan se muutujan url arvoksi.
            document.getElementById("tuotekuva").src = url; //vaihdetaan kuvaelementin src-attribuutiksi datasta haettu url.
        })
    lisääListalle(hakusana, maara);
}

hakubtn.addEventListener("click", hae);
window.addEventListener("DOMContentLoaded", listaus);