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
        app.get('/myJwl/:email', async (req, res) => {
            const email = req.params.email;
            const result = await allJewelryCollections.find({ email: email }).toArray()
            res.send(result)
            console.log(result)
        })
        // delete item
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await allJewelryCollections.deleteOne({ _id: new ObjectId(id) })
            res.send(result)
        })



        // client dashboard
        app.get('/client/:email', async (req, res) => {
            const email = req.params.email;
            if (req.decoded.email !== email) {
                return res.send({ isClient: false })
            }
            const query = { email: email }
            const user = await allJewelryCollections.findOne(query)
            const result = { isClient: user?.role === 'client' }
            res.send(result)
        })
        // admin dashboard
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            if (req.decoded.email !== email) {
                return res.send({ isAdmin: false })
            }
            const query = { email: email }
            const user = await allJewelryCollections.findOne(query)
            const result = { isAdmin: user?.role === 'admin' }
            res.send(result)
        })


        
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



