const express = require('express')
const app = express()


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/', (req, res) => {

     //send to '/' the text hello world;
     res.send('Hello world')


})


//start the application
run().catch(console.dir);


//code used to start our application
async function run() {
   try { 
        app.listen(3000);
    } catch (err) {
         console.log(err.stack);
    }
}
