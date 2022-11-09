const express = require("express")
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config();

// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('travellian').collection('services');
    const reviewCollection = client.db('travellian').collection('reviews');

    app.get('/services', async(req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services)
    });

    app.get('/limitservices', async(req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      // console.log(services);
      res.send(services)
    });

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne(query);
      res.send(service)
    });
  }
  finally{
    
  }
}
run().catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Travellian server is running')
})


app.listen(port, () => {
  console.log(`Travellian server is running on port ${port}`)
})