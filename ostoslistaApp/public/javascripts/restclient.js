const hakubtn = document.querySelector("#lisaa");

function yliviivaus() {

}

function poista() {
    
}

function lisääListalle(hakusana) {
let lista = document.querySelector('#lista'); //luo muuttujan valitsemastaan html-dokumentin elementistä
let ostos = document.createElement('li'); //luodaan uusi lista-elementti
ostos.innerHTML = hakusana; //asetetaan lista-elementin arvoksi käyttjän syöttämähakusana
let nappitehty = document.createElement('button'); // uusi muuttuja & luodaan samalla html-elementti
nappitehty.innerText = "Tehty"; //napin tekstiksi Tehty
let nappipoista = document.createElement('button'); //uusi muuttuja & luodaan samalla html-elementti
nappipoista.innerText = "Poista"; //napin tekstiksi Poista
ostos.appendChild(nappitehty); //lisätään ostos-html elementiin nappitehty
ostos.appendChild(nappipoista); //listään ostos-html elementiin nappipoista
lista.appendChild(ostos); //julkaistaan koko höskä

nappitehty.addEventListener('click', yliviivaus);
nappipoista.addEventListener('click', poista);
}

function hae() {
    const hakusana = document.querySelector("#hakusana").value; //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
    console.log(hakusana);
    fetch("localhost:3000/api/kuvahaku/" + hakusana)
    .then(vastaus => vastaus.json())
    .then(data => {
        console.log(data);
    })
    lisääListalle(hakusana);
}

hakubtn.addEventListener("click", hae);