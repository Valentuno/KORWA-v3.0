// nic nie bedzie dzialac bo przenioslem do baza_init.js




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





