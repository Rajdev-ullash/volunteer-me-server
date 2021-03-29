const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0wlb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteerMe").collection("eventsMe");
    const loginCollection = client.db("volunteerMe").collection("loginInfo");
    const signInCollection = client.db("volunteerMe").collection("signInInfo");


    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })
    
    app.post('/addEvents', (req, res)=>{
        const newEvent = req.body;
        // console.log('adding new event: ', newEvent);
        eventCollection.insertOne(newEvent)
        .then(result => {
            // console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/login', (req, res)=>{
        const newEvent = req.body;
        // console.log('adding new event: ', newEvent);
        loginCollection.insertOne(newEvent)
        .then(result => {
            // console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })
    app.post('/signIn', (req, res)=>{
        const newEvent = req.body;
        console.log('adding new event: ', newEvent);
        signInCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    // app.get('/infos', (req, res) => {
    //     signInCollection.find()
    //     .toArray((err, items) => {
    //         res.send(items);
    //     })
    // })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('deleted id', id)
        eventCollection.findOneAndDelete({_id: id})
        .then(result => 
            {result.deletedCount > 0})
            
    })


});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})