const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
//create app
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qykb2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('srrvice');

        //get data
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        });
        app.post('/service', async (req, res) => {
            const newService = req.body;
            console.log("nreservice", newService);
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });
        // delete
        app.delete('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const services = await serviceCollection.deleteOne(query);
            res.send(services);

        })

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

// 
app.get('/', (req, res) => {
    res.send('Running Car Server again');
});
app.get('/check', (req, res) => {
    res.send('checking ...');
});

app.listen(port, () => {
    console.log("Listening to port", port);
})
