const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT_ONE || 8080;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
const Product = require('./product');
const isAuthenticated = require('../isAuthenticated');

var connection, channel;

var order;

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/product-service', 
{ 
    useNewUrlParser: true, useUnifiedTopology: true 
}, 
() => { console.log('Connected to MongoDB'); 
});

async function connect() {
    
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('PRODUCT-SERVICE');
}
connect().then(() => {
    console.log('Connected to RabbitMQ');
}).catch((err) => {
    console.log(err);
});


app.post('/product/create', isAuthenticated, async(req, res) => {
    const { name, description, price } = req.body;

    const newProduct = await new Product({
        name,
        description,
        price,
    });

    newProduct.save();

    return res.status(201).send(newProduct);
});

app.post('/product/buy', isAuthenticated, async (req, res) => {
    const {ids} = req.body;
    const products = await Product.find({_id: {$in: ids}});

    channel.sendToQueue("ORDER-SERVICE", Buffer.from(
        JSON.stringify(
            {
                products,
                userEmail: req.user.email,
            })
            ));
    channel.consume("PRODUCT", (data) => {
        order = JSON.parse(data.content);
    });
    return res.json(order);
});

app.get("/", (req, res) => {
    res.status(200).send("welcome to product-service");
})

app.listen(PORT, () => {
    console.log(`product-Service listening on port ${PORT}`);
  });