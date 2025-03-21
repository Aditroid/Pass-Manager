const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');


const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'passmanager';
const app = express()
const port = 3000;
app.use(cors());
app.use(bodyparser.json());
client.connect();

//Get all Passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

//Save a Password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result : findResult});
});

//Delete the password
app.delete('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result : findResult});
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
