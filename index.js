const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())







const uri = "mongodb+srv://Jewelry-Shop:TLrFpFL5cm6kjev6@cluster0.2utjecm.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // initialize
        app.get('/', (req, res) => {
            res.send('running')
        })
        app.listen(port, () => {
            console.log('running')
        })

        const allJewelryCollections = client.db('Jewelry-Shop').collection('jewelries')
        app.get('/alljwl', async (req, res) => {
            const result = await allJewelryCollections.find().toArray()
            res.send(result)
            console.log(result)
        })

        // creating object
        app.post('/addJwl', async (req, res) => {
            const body = req.body;
            const result = await allJewelryCollections.insertOne(body);
            console.log(result)
            res.send(result)
        })
        // data by user
        app.get('/myJwl/:postedBy', async (req, res) => {
            const postedBy = req.params.postedBy;
            const result = await allJewelryCollections.find({ postedBy: postedBy }).toArray()
            res.send(result)
            console.log(result)
        })
        // delete item
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await allJewelryCollections.deleteOne({ _id: new ObjectId(id) })
            res.send(result)
        })


        
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



