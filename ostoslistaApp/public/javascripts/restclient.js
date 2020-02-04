const hakubtn = document.querySelector("#lisaa");

function hae() {
    const hakusana = document.querySelector("#hakusana").value; //hakukentän käyttäjän syöttämä sana lisätään fetch-pyynnössä urlin perään
    console.log(hakusana);
    fetch("localhost:3000/api/kuvahaku/" + hakusana)
    .then(vastaus => vastaus.json())
    .then(data => {
        console.log(data);
    })
}

hakubtn.addEventListener("click", hae);