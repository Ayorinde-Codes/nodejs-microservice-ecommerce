const express = require('express');
const cors  = require('cors');
const app = express();
const PORT = process.env.PORT_ONE || 9090;
const mongoose = require('mongoose');
const amqp = require('amqplib');
const Order = require('./order');

var connection, channel;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/order-service', 
{ 
    useNewUrlParser: true, useUnifiedTopology: true 
}, 
() => { console.log('Connected to MongoDB'); 
});


function createOrder(products, userEmail) {

    let total = 0;
    products.forEach(product => {
        total += product.price;
    }   );

    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
    });

    newOrder.save();

    return newOrder;
}
    

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('ORDER-SERVICE');
}
connect().then(() => {
    channel.consume('ORDER-SERVICE', (data) => {
        console.log('Consuming ORDER-SERVICE queue');

        const {products, userEmail} = JSON.parse(data.content);

        const newOrder = createOrder(products, userEmail);

        channel.ack(data);
        channel.sendToQueue('PRODUCT-SERVICE', Buffer.from(JSON.stringify({ newOrder })));
    })
});

app.get('/', (req, res) => { 
    res.status(200).send('welcome to order-service');
});

app.listen(PORT, () => {
    console.log(`Order-server listening on port ${PORT}`);
});