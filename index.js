const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
console.log(process.env.DB_USER)
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Welcome to the server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrtaw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("services").collection("items");
  const productsCollection = client.db("services").collection("products");

  // service uploading to the database
  app.post('/addService', (req, res) => {
    const service = req.body
    serviceCollection.insertOne(service)
      .then(result => {
        console.log(result.insertedCount > 0)
        res.send(result.insertedCount > 0)

      })
  })

  // service showing to the page
  app.get('/showService', (req, res) => {
    serviceCollection.find({ id: req.params._id })
      .toArray( (error, documents) => {
        res.send(documents)
      })
  })

  // delete services 
  app.delete('/deleteServices/:id', (req, res)=>{
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({_id: id})
    .then((err, result)=>{
        console.log(result)
        result.deletedCount > 0
    })
  })

  // products adding to the database collection
  app.post('/addProducts', (req, res) => {
    const service = req.body
    console.log(service)
    productsCollection.insertOne(service)
      .then(result => {
        console.log(result.insertedCount > 0)
        res.send(result.insertedCount > 0)

      })
  })
  
  // products is showing to the front page

  app.get('/showProducts', (req, res) => {
    productsCollection.find({id : req.params._id})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // product item ordered 
  
  console.log('database connection established')
});

app.listen(port, () => {
  console.log(`Server is connected on this port http://localhost:${port}`)
})