const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//midlware 
app.use(cors())
app.use(express.json())

//
//


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwideqp.mongodb.net/?retryWrites=true&w=majority`;

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


        const toyCollection = client.db('toytronics').collection('toys');


        // const indexKeys = { name: 1, category: 1 };
        // const indexOptions = { searchName: 'toy' }

        // const result = toyCollection.createIndex(indexKeys, indexOptions);


        app.get('/searchToy/:text', async (req, res) => {
            const searchtext = req.params.text;
            const result = await toyCollection.find({
                $or: [
                    { name: { $regex: searchtext, $options: "i" } },
                    { category: { $regex: searchtext, $options: "i" } }
                ]
            }).toArray()

            res.send(result)

        })


        app.post('/allToys', async (req, res) => {
            const addedToy = req.body
            console.log(addedToy)
            const result = await toyCollection.insertOne(addedToy);
            res.send(result)

        })

        app.get('/allToys', async (req, res) => {
            console.log(req)
            const cursor = toyCollection.find().limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allToys/:email', async (req, res) => {
            const email = req.params.email;
            console.log(req.params.email)
            const result = await toyCollection.find({ sellerEmail: email }).toArray();

            res.send(result)
        })

        app.get('/allToys/:email', async (req, res) => {
            const email = req.params.email;
            console.log(req.params.email)
            const result = await toyCollection.find({ sellerEmail: email }).sort({"price": 1}).toArray();

            res.send(result)
        })

        app.get('/singleToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result)
        })


        app.put('/updateToy/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body
            const filter = { _id: new ObjectId(id) }

            const updatedDoc = {
                $set: {
                    photo: body.photo,
                    price: body.price,
                    rating: body.rating,
                    quntity: body.quntity,
                    details: body.details,
                }
            }
            const result = await toyCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.delete('/singleToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);

            res.send(result)
        })
        // Send a ping to confirm a successful connection
        //  client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Toytronics server in runnig')
})

app.listen(port, () => {
    console.log(`toytronics server is running on port: ${port}`)
})