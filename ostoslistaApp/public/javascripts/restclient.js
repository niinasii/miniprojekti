const hakubtn = document.querySelector("#lisaa");

function yliviivaus() {
    let nappi = this;
    let ostos = nappi.parentElement;
    ostos.classList.toggle("yliviivaus"); // Lisää listaelementille luokan yliviivaus -otto
    nappi.innerText = "Peruuta"; //vaihtaa napin tekstin
}

function poista() {
    let nappi = this;
    let ostos = nappi.parentElement;
    ostos.remove(); //poistaa listaelementin, jonka lapsena poista-nappi on.
}

function muokkaa() {
    alert("ei vielä implementoitu. sori.");
}

function lisääListalle(hakusana, maara) {
let lista = document.querySelector('#lista'); //luo muuttujan valitsemastaan html-dokumentin elementistä
let ostos = document.createElement('li'); //luodaan uusi lista-elementti
ostos.innerHTML = `${hakusana} * ${maara} `; //asetetaan lista-elementin arvoksi käyttjän syöttämä hakusana ja määrä
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
}

function hae() {
    const hakusana = document.querySelector("#hakusana").value; //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
    const maara = document.querySelector("#maara").value;
    console.log(hakusana);
    fetch("http://localhost:3000/api/users" + hakusana)
    .then(vastaus => vastaus.json())
    .then(data => {
        console.log(data);
        let url = data.hits.pageURL;  //poimitaan vastausdatasta kuvan url-osoite ja asetetaan se muutujan url arvoksi.
        document.getElementById("tuotekuva").src = url; //vaihdetaan kuvaelementin src-attribuutiksi datasta haettu url.

    })
    lisääListalle(hakusana, maara);
}

hakubtn.addEventListener("click", hae);