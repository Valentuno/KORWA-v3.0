









let AlkoholeArr = []
let AlkoholeArrSortedRent = []

let createAlcohol = function(name,img,rentownosc,ocena,typ) {
    let obj = {
        id: AlkoholeArr.length,
        name: name,
        image: img,
        rentownosc: rentownosc,
        ocena: ocena,
        typ: typ
    }
    AlkoholeArr.push(obj)
    AlkoholeArrSortedRent.push(obj)
}

createAlcohol("Desperados", "images/desperados.png", 4.37, 6.78, "piwo");
createAlcohol("Zatecky", "images/zatecky.png", 7.62, 6.34, "piwo");
createAlcohol("Heineken", "images/heineken.png", 5.83, 6.71, "piwo");
createAlcohol("Perła Export", "images/perła_export.png", 7.47, 6.3, "piwo");
createAlcohol("Carlsberg", "images/carlsberg.png", 5.71, 6.22, "piwo");
createAlcohol("Kustosz Mocne", "images/kustosz_mocne.png", 12.63, 3.84, "piwo");
createAlcohol("Lech", "images/lech.png", 6.28, 6.21, "piwo");
createAlcohol("Lomża", "images/lomża.png", 7.54, 6.1, "piwo");
createAlcohol("Redds Malina", "images/redds_malina.png", 4.8, 6.03, "piwo");
createAlcohol("Perła Chmiel", "images/perła_chmiel.png", 8.62, 5.47, "piwo");
createAlcohol("Tyskie", "images/tyskie.png", 7.47, 5.41, "piwo");
createAlcohol("Harnaś", "images/harnaś.png", 11.17, 5.34, "piwo");
createAlcohol("Warka", "images/warka.png", 7.47, 5.17, "piwo");
createAlcohol("Żubr", "images/żubr.png", 10.07, 4.79, "piwo");
createAlcohol("Piast", "images/piast.png", 6.91, 4.7, "piwo");
createAlcohol("Specjal", "images/specjal.png", 10.94, 4.59, "piwo");
createAlcohol("Tatra", "images/tatra.png", 8.51, 4.17, "piwo");
createAlcohol("Stock", "images/stock.png", 6.06, 7.23, "wódka");
createAlcohol("Soplica Cytryna", "images/soplica_cytryna.png", 5.56, 7.01, "wódka");
createAlcohol("Lubelska Cytryna", "images/lubelska_cytryna.png", 5.77, 6.73, "wódka");
createAlcohol("Bocian", "images/bocian.png", 5.91, 6.51, "wódka");
createAlcohol("Amundsen", "images/amundsen.png", 5.6, 6.49, "wódka");
createAlcohol("Stumbrass", "images/stumbrass.png", 5.56, 5.97, "wódka");
createAlcohol("Wyborowa", "images/wyborowa.png", 6.25, 5.83, "wódka");
createAlcohol("Smirnoff", "images/smirnoff.png", 4.0, 5.44, "wódka");
createAlcohol("Luksusowa", "images/luksusowa.png", 7.0, 5.0, "wódka");
createAlcohol("Żubrówka", "images/żubrówka.png", 7.65, 4.89, "wódka");

AlkoholeArrSortedRent = AlkoholeArrSortedRent.sort((a,b) => a.rentownosc - b.rentownosc)
console.log(AlkoholeArrSortedRent)

let oblicz_odleglosc = function (){
    let g = parseFloat(document.getElementById("rentownosc").innerHTML)

    let testArray = []

    for(let i =0;i<AlkoholeArrSortedRent.length;i++){
        
        let a = AlkoholeArrSortedRent[i]
        let b=a.name
        let c =a.rentownosc-g
        c = Math.abs(c)
        d = a.image,
        e = a.rentownosc,
        f = a.ocena
        h = a.typ
        let obj = {
        name:b,
        image:d,
        rentownosc:e,
        ocena:f,
        typ:h,
        odleglosc:c

        }
        testArray.push(obj)
    

    
    }
    testArray = testArray.sort((a,b)=> a.odleglosc - b.odleglosc)
    console.log(testArray[0],testArray[1])


}


let finder = document.getElementById("finder")
finder.onclick = oblicz_odleglosc





