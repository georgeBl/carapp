const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "changeme"
const client = new MongoClient(url, { useUnifiedTopology: true });
 
 // The database to use
 const dbName = "dealership";
 

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))

let db, carDb;

run().catch(console.dir);


//home page route
app.get('/', (req, res) => { 
    // console.log(carDb)
    res.send('Hello world')
})

//get car router
app.get('/car/:id', (req, res) => {
    console.log('You are in the car route');
    
    async function findCar() {
        const foundCar = await  carDb.findOne({model:"model1"})
        res.json(foundCar)
    };
    findCar();
})

//post car route
app.post('/car', (req, res) =>{
    console.log('I have received a post request in the /car route');
    //create a car object
    let car = new Car(req.body.make, req.body.model, req.body.availability, req.body.fuelType, req.body.warranty)
    //insert it to the database
    carDb.insertOne(car)
    res.sendStatus(200)

})


// car router for the update
app.put('/car', (req, res) => {
    console.log(' Car router for update ');
    async function findCar() {
        try{
        const foundCar = await  carDb.findOne({"_id": ObjectId(req.body.id)})
        //if the car is found edit it and send a message to the user
        if(foundCar !== null){
            let car = new Car(
                            foundCar.make, 
                            foundCar.model, 
                            foundCar.availability, 
                            foundCar.fuelType, 
                            foundCar.warranty)
            car.make = req.body.make;
            // console.log(car);
            try{
            const updateResult = await carDb.updateOne(
                                                {"_id": ObjectId(req.body.id)}, 
                                                {$set:car})
            } catch(err){
                console.log(err.stack)
            }
            // console.log(updateResult.modifiedCount)       
            res.send("The car was updated");            
        } else {
              //if the car is not found send a message to the user saying that this entry doe not exist
            res.send("Te car was not updated");
        }}catch(err){
            res.send("Object id is invalid")
        }
    };
    findCar();

})
// car router to delete
app.delete('/car', (req, res) =>{

    console.log('Car router to delete one car');

    console.log(req.body.id)

    carDb.deleteOne({"_id": ObjectId(req.body.id)})
    async function findCar() {
        const foundCar = await  carDb.findOne({"_id": ObjectId(req.body.id)})
        if(foundCar !== null){
            res.send("The entry was not deleted")
        }
        res.send("The entry was deleted")
    };
    findCar();
})

//code used to start our application
async function run() {
    // try to start the application only if the database is connected correctly
    try {
        //connect to the database
        await client.connect();
        
        //connect to the right database ("dealership")
        db = client.db(dbName);

        //get reference to our car "table"
        carDb = db.collection("car");

        //start listening to requests (get/post/etc.)
        app.listen(3000);
    } catch (err) {
        //in case we couldn't connect to our database throw the error in the console
         console.log(err.stack);
    }
}


class Car {
    constructor(make, model, availability =false, fuelType, warranty){
        this.make = make;
        this.model = model;
        this.availability = availability;
        this.fuelType = fuelType;
        this.warranty = warranty;
    }

    printValues(){
        console.log(this.make, this.model, this.availability, this.fuelType, this.warranty);
    }
}