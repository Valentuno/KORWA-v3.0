const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto-js');

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

const daneUsers = new mongoose.Schema({
    login:String,
    password:String
})

const DaneAlk = mongoose.model('DaneAlk', daneSchemaAlk, 'Alcohols');
const DaneUpdates = mongoose.model('DaneUpdates', daneSchemaUpdate, 'Updates')
const DaneUsers = mongoose.model("DaneUsers", daneUsers, "Users")

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

        let checkexistance = await DaneAlk.find({id:parseFloat(id)})
        if (checkexistance.length >0) {
            console.log("ISTNIEJE taki rekord",checkexistance.length)
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
                    // console.log(daneOcen[i])
                    // console.log(averageOcena,ocenaCount)
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
        } else {
            console.log("Nie ma takiego ID - nie dodano rekordu do kolekcji Updates")
        }




    } catch (error){
        console.error("Błąd zapisu", error)
        res.status(500).json({error:"Wystąpił błąd serwera"})
    }
})

app.post("/dodajRekord", express.json(), async (req, res) =>{
    try {
        const {name,image,rentownosc,ocena,typ} = req.body
        let liczbaArray = await DaneAlk.find({})
        const newRecord = new DaneAlk({
            id: liczbaArray.length,
            name,
            image,
            rentownosc,
            ocena,
            typ
        })

        let checkexistance = await DaneAlk.findOne({name:name})
        console.log("CHECKED", checkexistance)
        if (checkexistance == null) {
            await newRecord.save()

            res.status(201).json({message: "Propozycja zapisana"})
            console.log("Dodano do bazy",newRecord)
        } else {
            console.log("Istnieje juz taki rekord")
        }


    




    } catch (error){
        console.error("Błąd zapisu", error)
        res.status(500).json({error:"Wystąpił błąd serwera"})
    }
})

app.delete('/danedous/:id', async (req, res) => {
    try {
        const {id} = req.params
        let checkexistance = await DaneAlk.findOne({id:id})
        if (checkexistance) {
            const deletedDocument = await DaneAlk.findOneAndDelete({id:id});
            res.json({message: "Usunieto rekord"});
            console.log("USUNELO")
        } else {
            console.log("Takie ID nie istnieje")
        }

    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});


app.post("/dodajUzytkownik", express.json(), async (req, res) =>{
    try {
        const {login,password} = req.body

        let hashedPassword = crypto.SHA256(password).toString()

        const newRecord = new DaneUsers({
            login,
            password: hashedPassword,
        })

        let checkexistance = DaneUsers.findOne({login:login})
        if (!checkexistance) {
            await newRecord.save()

            res.status(201).json({message: "Propozycja zapisana"})
            console.log("Dodano do bazy",newRecord)
        } else {
            console.log("Istnieje juz taki uzytkownik")
        }


        
    } catch (error){
        console.error("Błąd zapisu", error)
        res.status(500).json({error:"Wystąpił błąd serwera"})
    }
})


app.post("/login", express.json(), async (req, res) =>{
    try {
        const {login,password} = req.body

        let hashedPassword = crypto.SHA256(password).toString()
        let checkexistance = await DaneUsers.findOne({login:login})
        if (checkexistance) {
            
            if (checkexistance.password == hashedPassword) {
                console.log("UDANE ZALOGWANIE")
                // res.status(201).json({message: "Udało się zalogować"})
                console.log("")
                return res.redirect('/udanarejestracja.html')
            } else {
                console.log("podałeś błędne hasło")
            }


        } else {
            console.log("nie ma takiego uzytkownika")
        }




        
    } catch (error){
        console.error("Błąd zapisu", error)
        res.status(500).json({error:"Wystąpił błąd serwera"})
    }
})