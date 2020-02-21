const hakubtn = document.querySelector("#lisaa");
const tallennusbtn = document.querySelector("#tallennus");
const ravinteetbtn = document.querySelector("#ravinteet");
const aanetbtn = document.querySelector("#aanet");
const listatyhjaksibtn = document.querySelector("#listatyhjaksibtn");
const hakusana = document.querySelector("#hakusana"); //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
const maara = document.querySelector("#maara");
const yksikko = document.querySelector("#yksikko");

class Tuote {

    constructor(hakusana, maara, yksikko) {
        this.hakusana = hakusana;
        this.maara = maara;
        this.yksikko = yksikko;
    }
}

//merkkaa jo koriin kerätyn tuotteen yliviivatuksi
function yliviivaus() {
    let nappi = this;
    let ostos = nappi.parentElement;
    ostos.classList.toggle("yliviivaus"); // Lisää listaelementille luokan yliviivaus -otto
    nappi.innerText === "Peruuta" ? nappi.innerText = "✓" : nappi.innerText = "Peruuta"; //vaihtaa napin tekstin
}

//poistaa yhden listaelementin sekä clientti- että palvelinpäästä
function poista() {
    //kaikki tämä regex-hulluus johtuu siitä, että listaelementin sisältöön kuuluu muutakin, kuin ostoksen nimi. älä kysy. -otto
    let nappi = this;
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let regex = /^[A-ZÅÄÖ]+/i;
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

//muokkaa ostoksen määrää tai yksikköä selain- ja palvelinpäässä
function muokkaa() {
    //haetaan tuotteen nimi ja tallennetaan se muuttujaan "ostos"
    let nappi = this;
    this.setAttribute("disabled", "true")
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let ostosregex = /^[A-ZÅÄÖ]+/i;
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
    //luodaan muokattavan tuotteen yksikkölista
    let yksikkolista = document.createElement("select");
    yksikkolista.setAttribute("id", "muokkaayksikkolista")
    //luodaan yksikkölistan valinnat
    let yksikkoArr = ["kpl", "litra(a)", "kg", "g", "pss", "prk"];
    yksikkoArr.forEach(yksikkoteksti => {
        let yksikkolistaitem = document.createElement("option");
        yksikkolistaitem.setAttribute("value", yksikkoteksti);
        yksikkolistaitem.innerText = yksikkoteksti;
        yksikkolista.appendChild(yksikkolistaitem);
    });

    listaelementti.appendChild(yksikkolista);
    listaelementti.appendChild(tallennusnappi);

    tallennusnappi.addEventListener("click", paivita);


    function paivita() {    //kirjoitetaan put-pyyntö
        let uusimaara = muokkaakentta.value;
        if (uusimaara === "") {
            alert("Kenttä ei voi olla tyhjä.");
            return;
        }
        let yksikko = yksikkolista.value;
        let paivitys = new Tuote(ostos, uusimaara, yksikko);
        fetch("http://localhost:3000/api/users/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paivitys)
        })
            .then(response => response.json())

        listaelementti.remove();
        lisääListalle(paivitys);
    }
}

//lähettää uuden tuotteen
function lähetys() {
    ravinteetdiv.innerHTML = ""; // tyhjentää ravinnelistan painettaessa tallenna listalle- nappia

    let ostos = new Tuote(hakusana.value, maara.value, yksikko.value);

    //tarkistetaan ettei tuotteen nimi ala numerolla
    if (!ostos.hakusana.charAt(0).match(/[a-zåöä]/i)) {
        alert("Tuotenimi ei voi alkaa muulla kuin kirjaimella.");
        return;
    }

    //tarkistetaan ettei määrä ole vähemmän kuin 1 tai muuta kuin nro
    if (ostos.maara < 1 || isNaN(parseInt(ostos.maara))) {
        alert("lisää vähintään yksi!");
        return;
    }

    //tarkistetaan ettei tuotteen nimellä ole jo listalla jotain
    try {
        loytyykoJoListalta(ostos.hakusana);
    }
    catch (error) {
        alert(error);
        return;
    }

    //suoritetaan post-pyyntö listalle
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
    listaus();
    haeKuva();
}

function loytyykoJoListalta(ostos) {
    let ul = document.querySelector("#lista")
    let liArr = ul.getElementsByTagName("li")

    for (i = 0; i < liArr.length; i++) {
        let item = liArr[i];
        let regex = /^[A-ZÅÄÖ]+/i;
        let listaTuote = item.innerText.match(regex)[0];

        if (ostos === listaTuote) {
            throw "Tuote löytyy jo listalta. Poista tai muokkaa listalta löytyvää tuotetta.";
        }
    }
}

//hakee palvelimelle tallenetun json muotoisen ostoslistan
function listaus() {
    while (document.querySelector("#lista").firstChild) {
        document.querySelector("#lista").removeChild(document.querySelector("#lista").firstChild);
    }
    fetch("http://localhost:3000/api/users")
        .then(vastaus => vastaus.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let ostos = new Tuote(data[i].hakusana, data[i].maara, data[i].yksikko)
                lisääListalle(ostos);
            }
        })
}

function lisääListalle(ostos) {

    //luodaan listaitemille napit ja niiden toiminnallisuudet
    let lista = document.querySelector('#lista'); //luo muuttujan valitsemastaan html-dokumentin elementistä
    let ostosLi = document.createElement('li'); //luodaan uusi lista-elementti
    ostosLi.setAttribute("class", "ostosli");
    ostosLi.innerHTML = `${ostos.hakusana} x ${ostos.maara} ${ostos.yksikko} `; //asetetaan lista-elementin arvoksi käyttjän syöttämä hakusana ja määrä
    let nappitehty = document.createElement('button'); // uusi muuttuja & luodaan samalla html-elementti
    nappitehty.innerText = "✓"; //napin tekstiksi Tehty
    let nappipoista = document.createElement('button'); //uusi muuttuja & luodaan samalla html-elementti
    nappipoista.innerText = "⌫"; //napin tekstiksi Poista
    let nappimuokkaa = document.createElement("button");
    nappimuokkaa.innerText = "✎"; //napin tekstiksi muokkaa
    let nappiravinto = document.createElement("button");
    nappiravinto.innerText = "?";
    ostosLi.appendChild(nappiravinto); //lisätään itemille ravintosisältöpainike
    ostosLi.appendChild(nappipoista); //listään ostosLi-html elementiin nappipoista
    ostosLi.appendChild(nappimuokkaa); //lisätään ostosLi-elementille nappi muokkaa
    ostosLi.appendChild(nappitehty); //lisätään ostosLi-html elementiin nappitehty
    lista.appendChild(ostosLi); //julkaistaan koko höskä
    ostosLi.addEventListener("click", haeKuvaListasta);

    nappitehty.addEventListener('click', yliviivaus); //lisätään napille toiminto "yliviivaus"
    nappipoista.addEventListener('click', poista); // lisätään napille toiminto "poista"
    nappimuokkaa.addEventListener("click", muokkaa);
    nappiravinto.addEventListener("click", haeRavinteetListasta);

    //annetaan napeille vielä id:t -otto
    nappitehty.classList.add("nappitehty");
    nappipoista.classList.add("nappipoista");
    nappimuokkaa.classList.add("nappimuokkaa");
    nappiravinto.classList.add("nappiravinto");

    //annetaan napeille myös altit -Niina
    nappitehty.setAttribute("alt", "Tuote kerätty");
    nappimuokkaa.setAttribute("alt", "Muokkaa tuotetta listalla");
    nappipoista.setAttribute("alt", "Poista tuote listalta");
    nappiravinto.setAttribute("alt", "Näytä tuotteen ravintosisältö")
}

function haeKuva() {
    fetch("http://localhost:3000/api/users/" + hakusana.value)
        .then(vastaus => vastaus.json())
        .then(data => {
            // data pitää sisällään 20 eri ruokakuvavaihtoehtoa.
            let url = data.hits[0].largeImageURL;  //poimitaan vastausdatasta kuvan url-osoite ja asetetaan se muutujan url arvoksi.
            document.getElementById("tuotekuva").src = url; //vaihdetaan kuvaelementin src-attribuutiksi datasta haettu url.
        })
    // lisääListalle(hakusana.value, maara.value);
}

function haeKuvaListasta(event) {
    //kaivetaan esiin listatuotteen nimi
    let regex = /^[A-ZÅÄÖ]+/i;
    let listaTuote;
    if (event.path) {
        console.log(event.path);
        listaTuote = event.path[0].innerText.match(regex)[0];
    } else {
        console.log("ei löydy.");
        return;
    }
    
    //tämä erittäin köykäinen if-else if-else -lauseke estää klikkausten aiheuttamat ei-toivotut kuvahaut. En ole tästä ylpeä. 
    if (listaTuote === "Muokkaa" || listaTuote === "Peruuta" || listaTuote === "Kerätty" || listaTuote === "Poista" || listaTuote === "poisto") {
        listaTuote = event.path[1].innerText.match(regex)[0];
    } else if (listaTuote === "kpl") {
        listaTuote = event.path[2].innerText.match(regex)[0];
    } else if (listaTuote === "Päivitä") {
        listaTuote = event.path[3].innerText.match(regex)[0];
    }

    //haetaan kuva tuotteen nimellä
    fetch("http://localhost:3000/api/users/" + listaTuote)
        .then(vastaus => vastaus.json())
        .then(data => {
            // data pitää sisällään 20 eri ruokakuvavaihtoehtoa.
            let url = data.hits[0].largeImageURL;  //poimitaan vastausdatasta kuvan url-osoite ja asetetaan se muutujan url arvoksi.
            document.getElementById("tuotekuva").src = url; //vaihdetaan kuvaelementin src-attribuutiksi datasta haettu url.
        })
}

function haeRavinteet() {

    fetch("http://localhost:3000/api/ravinteet/" + hakusana.value) //lähettää hakusanalla pyynnön palvelimelle
        .then(vastaus => vastaus.json())
        .then(data => {
            JSON.stringify(data) //muuttaa Javascript olioksi
            console.log(data)
            otsikko.innerHTML = "Ravintosisältö / 100g"
      
            for (let i = 0; i < 3; i++) { //luuppaa läpi kolme ensimmäistä hakutulosta
                //Hakee nimen ja sen alle listalementeiksi valitus ravintosisällöt:
                const uusili = document.createElement('ul');
                uusili.innerHTML += `${data[i].name.fi} <li> alkoholi: ${(data[i].alcohol).toFixed(2)} % </li> <li>proteiini: ${data[i].protein.toFixed(2)} g </li> <li> energia: ${data[i].energyKcal.toFixed(2)} Kcal </li> <li> hiilarit: ${data[i].carbohydrate.toFixed(2)} g </li> <li>rasva: ${data[i].fat.toFixed(2)} g </li> <li> sokeri: ${data[i].sugar.toFixed(2)} g </li> <li> suola: ${((data[i].salt)/1000).toFixed(2)} g </li>`;
                //Edelline pyöristää luvut kahteen desimaaliin ja muuttaa suolan mg-->g
                document.querySelector("#ravinteetdiv").appendChild(uusili);
            }
        })
}

function haeRavinteetListasta() {
    let nappi = this;
    this.setAttribute("disabled", "true")
    let listaelementti = nappi.parentElement;
    let listateksti = listaelementti.innerHTML;
    let ostosregex = /^[A-ZÅÄÖ]+/i;
    let ostos = listateksti.match(ostosregex);
    ostos = ostos[0];
    ostos = ostos.substring(0, ostos.length);

    fetch("http://localhost:3000/api/ravinteet/" + ostos)
        .then(vastaus => vastaus.json())
        .then(data => {
            JSON.stringify(data)
            console.log(data)
            otsikko.innerHTML = "Ravintosisältö / 100g"

            for (let i = 0; i < 3; i++) { //palauttaa kolme ensimmäistä hakutulosta
                //Hakee nimen ja sen alle listalementeiksi valitus ravintosisällöt
                const uusili = document.createElement('ul');
                ravinteetdiv.innerHTML += `${data[i].name.fi} <li> alkoholi: ${(data[i].alcohol).toFixed(2)} % </li> <li>proteiini: ${data[i].protein.toFixed(2)} g </li> <li> energia: ${data[i].energyKcal.toFixed(2)} Kcal </li> <li> hiilarit: ${data[i].carbohydrate.toFixed(2)} g </li> <li>rasva: ${data[i].fat.toFixed(2)} g </li> <li> sokeri: ${data[i].sugar.toFixed(2)} g </li> <li> suola: ${((data[i].salt) / 100).toFixed(2)} g </li>`;
                document.querySelector("#ravinteetdiv").appendChild(uusili);
            }
        })
}

function haeAanet() {

    let ostostaulukko = []

    fetch("http://localhost:3000/api/aanet") //lähettää pyynnön palvelimelle
        .then(vastaus => vastaus.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) { //looppaa datan läpi
                let sanat = data[i].hakusana
                ostostaulukko.push(sanat) //lisää ostostaulukkoon ostoslistan tuotteiden nimet
            console.log(sanat)

    let osoite = "http://api.voicerss.org/?key=43217f932d0f4f50a047dbc4785fe8c3&hl=ru-ru&src=" //voice rss api-osoite
       
        document.getElementById("aani").src = osoite + ostostaulukko
        console.log(osoite)
    } })
}

function tyhjennaLista() {
    let lista = document.querySelector("#lista");
    while (lista.firstChild) {
        let listaelementti = lista.firstChild;
        let listateksti = listaelementti.innerHTML;
        let regex = /^[A-ZÅÄÖ]+/i;
        let ostos = listateksti.match(regex);
        ostos = ostos[0];
        ostos = ostos.substring(0, ostos.length);

        let ostosolio = new Tuote(ostos, 0);

        // luodaan DELETE -fetch-pyyntö. 
        fetch("http://localhost:3000/api/users/", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ostosolio)
        })
            .then(response => response.json())
            .then(data => console.log("poisto onnistunut, vastaus: " + data));

        listaelementti.remove();

    }
    otsikko.innerHTML = "";
    lista.innerHTML = "";
    ravinteetdiv.innerHTML = "";
}

tallennusbtn.addEventListener("click", lähetys);
window.addEventListener("DOMContentLoaded", listaus);
ravinteetbtn.addEventListener("click", haeRavinteet);
listatyhjaksibtn.addEventListener("click", tyhjennaLista);
aanetbtn.addEventListener("click", haeAanet);
