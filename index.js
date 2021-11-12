const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhfqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('symaOfficial');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');


    // GET API
    app.get('/products', async (req, res) => {
      const cursor = await productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // GET Single products
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific product', id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });
    // MY ORDERS
    // app.get('/myOrders/:email',)


    // POST API
    app.post('/productSymaOfficial', async (req, res) => {
      const product = req.body;
      console.log('hit the post api', product);

      const result = await productsCollection.insertOne(product);
      console.log(result);
      res.json(result)
    });


    // DELETE API
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });


    // confirm order
    app.post('/confirmOrder', async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });

    // my confirmOrder

    app.get('/myOrders/:email', async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // delete order

    app.delete('/deleteOrder/:id', async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    
    // all order
    app.get("/allOrders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // update statuses

    app.put("/status/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body.status;
      const filter = { _id: ObjectId(id) };
      console.log(updatedStatus);
      ordersCollection
        .updateOne(filter, {
          $set: { status: updatedStatus },
        })
        .then((result) => {
          res.send(result);
        });
    });

  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('drone server is running')
});

app.listen(port, () => {
  console.log('Running symaOfficial on port', port);
});


