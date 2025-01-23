let slider_pojemnosc = document.getElementById("slider-pojemnosc")
let input_pojemnosc = document.getElementById("input-pojemnosc")

let slider_zawartosc = document.getElementById("slider-zawartosc")
let input_zawartosc = document.getElementById("input-zawartosc")

let input_cena = document.getElementById("input-cena")

input_pojemnosc.value = slider_pojemnosc.value

let funkcja_obliczajaca = function() {
    let pojemnosc = parseFloat(slider_pojemnosc.value)
    let zawartosc = parseFloat(slider_zawartosc.value)*0.01
    let cena = parseFloat(input_cena.value)
    let gramatura = pojemnosc*zawartosc
    gramatura = gramatura.toFixed(2)
    let oplacalnosc = gramatura/cena
    oplacalnosc = oplacalnosc.toFixed(2)
    let etanol = document.getElementById("etanol")
    
    let rentownoschtml = document.getElementById("rentownosc")
    etanol.innerHTML = gramatura
    rentownoschtml.innerHTML = oplacalnosc 
}

slider_pojemnosc.oninput = function () {
    input_pojemnosc.value = this.value
    funkcja_obliczajaca()
}

input_pojemnosc.oninput = function() {
    if (input_pojemnosc.value > 1000) {
        input_pojemnosc.value = 1000
    }
    if (input_pojemnosc.value < 10) {
        input_pojemnosc.value = 10
    }
    slider_pojemnosc.value = this.value
    funkcja_obliczajaca()
}

slider_zawartosc.oninput = function() {
    input_zawartosc.value = this.value
    funkcja_obliczajaca()
}

input_zawartosc.oninput = function() {
    if (input_zawartosc.value > 1000) {
        input_zawartosc.value = 1000
    }
    if (input_zawartosc.value < 10) {
        input_zawartosc.value = 10
    }
    slider_zawartosc.value = this.value
    funkcja_obliczajaca()
}

input_cena.oninput = function() {
    if (input_cena.value > 10000) {
        input_cena.value = 10000
    }
    if (input_cena.value < 0) {
        input_cena.value = 0
    }
    funkcja_obliczajaca()
}


