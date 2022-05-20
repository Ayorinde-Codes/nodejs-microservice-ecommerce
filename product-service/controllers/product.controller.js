const Product = require('../models/product');
const amqp = require('amqplib');
var connection, channel, order;

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


exports.create = async(req, res) => {
    const {name, description, price} = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
    });
    newProduct.save();
    res.status(201).send(newProduct);
}

exports.buy = async(req, res) => {
    const {ids} = req.body;
    const products = await Product.find({_id: {$in: ids}});

    channel.sendToQueue("ORDER-SERVICE", Buffer.from(
        JSON.stringify({
                products,
                userEmail: req.user.email,
            })
            )
        );
    channel.consume("PRODUCT-SERVICE", (data) => {
        console.log("Consuming PRODUCT-SERVICE queue");
        order = JSON.parse(data.content);
        channel.ack(data);
    });
    return res.status(201).send(order);
}