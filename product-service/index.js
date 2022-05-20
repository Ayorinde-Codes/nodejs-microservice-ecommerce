const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT_ONE || 8080;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
const Product = require('./models/product');
const isAuthenticated = require('../isAuthenticated');
app.use(cors());

app.use(express.json());

require('./routes/index')(app);

var connection, channel;

var order;



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


app.get("/", (req, res) => {
    res.status(200).send("welcome to product-service");
})

app.listen(PORT, () => {
    console.log(`product-Service listening on port ${PORT}`);
  });