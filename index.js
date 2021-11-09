const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
console.log(process.env.DB_USER)
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Welcome to the server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrtaw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("services").collection("items");
  // perform actions on the collection object
        console.log('database connection established')
});

app.listen(port, () => {
  console.log(`Server is connected on this port http://localhost:${port}`)
})