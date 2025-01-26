const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;
const uri = 'mongodb://127.0.0.1:27017/db_webapp'; // Twój URI

const {AlkoholeArrSortedId, UpdatesArr} = require("./baza_init")
mongoose.connect(uri, {

}).then(() => console.log('Połączono z MongoDB'))
.catch(err => console.error('Błąd połączenia z MongoDB', err));

const daneSchemaAlk = new mongoose.Schema({
    id:Number,
    name:String,
    image:String,
    rentownosc:Number,
    ocena:Number,
    typ:String,

});

const daneSchemaUpdate = new mongoose.Schema({
    id:Number,
    proposedOcena: Number,
})

const DaneAlk = mongoose.model('DaneAlk', daneSchemaAlk, 'Alcohols');
const DaneUpdates = mongoose.model('DaneUpdates', daneSchemaUpdate, 'Updates')

async function pierwszeDodanie(){
    try {
        const count = await DaneAlk.countDocuments({})
        if (count === 0) {
            await DaneAlk.insertMany(AlkoholeArrSortedId)
            console.log("DZIALA")
    
        }else {
            console.log("Kolekcja nie jest pustaa")
        }
        
    } catch (error) {
        console.error("Błąd dodawania danych", error)
    }
}
pierwszeDodanie()

async function drugieDodanie(){
    try{
        const count = await DaneUpdates.countDocuments({})
        if (count === 0) {
            await DaneUpdates.insertMany(UpdatesArr)
            console.log("Dodano rekordy do Updates")
        } else {
            console.log("Kolekcja Updates nie jest pusta")
        }
    } catch (error) {
        console.error("Błąd dodawania danych", error)
    }
}
drugieDodanie()


// Obsługa plików statycznych (ważne!)
app.use(express.static(path.join(__dirname, '..'))); // Cofamy się o jeden katalog

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'baza.html')); // Ścieżka do baza.html
});

app.get('/dane', async (req, res) => {
    try {
        const dane = await DaneAlk.find({});
        res.json(dane);
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});

app.post("/proposeUpdate", express.json(), async (req, res) =>{
    try {
        const {id, proposedOcena} = req.body
        const newProposal = new DaneUpdates({
            id: parseInt(id),
            proposedOcena,
        })

        await newProposal.save()

        res.status(201).json({message: "Propozycja zapisana"})
        console.log(newProposal)

        let daneOcen = await DaneUpdates.find({id:parseFloat(id)})
        // console.log(daneOcen) daneOcen to tablica
        let wyliczSrednia = function () {
            let averageOcena = 0
            let ocenaCount = 0
            for(let i = 0;i<daneOcen.length;i++) {
                let ocena = daneOcen[i].proposedOcena
                averageOcena = averageOcena + ocena
                ocenaCount = ocenaCount + 1
                console.log(daneOcen[i])
                console.log(averageOcena,ocenaCount)
            }
            let sredniaOcena = averageOcena/ocenaCount
            console.log(sredniaOcena)
            return sredniaOcena.toFixed(2)
        }


        const alcoholDoZmiany = await DaneAlk.findOneAndUpdate(
            {id:parseFloat(id)},
            {ocena: wyliczSrednia()},
            {new:true}
        )
        // console.log(alcoholDoZmiany)


    } catch (error){
        console.error("Błąd zapisu", error)
        res.status(500).json({error:"Wystąpił błąd serwera"})
    }
})