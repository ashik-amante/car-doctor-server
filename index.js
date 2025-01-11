const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewire
app.use(cors())
app.use(express.json())

console.log(process.env.DB_user);


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.pdx5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // get all services data 
    app.get('/services',async(req,res)=>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // get specific sewrvice data
    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const quary = {_id : new ObjectId(id)}

      const options = {
        
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1 , service_id : 1},
      };

      const result = await serviceCollection.findOne(quary,options);
      res.send(result)
    })

    const serviceCollection = client.db('carDoctor').collection('services');


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('doctor is running')
})

app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})