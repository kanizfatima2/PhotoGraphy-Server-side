const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER, process.env.PASSWORD)

//Mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.qx4rjdo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//database Connection
if (uri) {
    console.log('Database Connected')
}



app.get('/', (req, res) => {
    res.send('Service Server is running')
})

app.listen(port, (req, res) => {
    console.log('listening to port ', port)
})