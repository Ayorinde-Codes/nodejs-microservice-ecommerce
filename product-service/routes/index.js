const controller = require('../controllers/product.controller');
const isAuthenticated = require('../../isAuthenticated');

module.exports = (app) => {

    // app.post('/product/create', isAuthenticated,  async(req, res) => {
    //     const { name, description, price } = req.body;
    
    //     const newProduct = await new Product({
    //         name,
    //         description,
    //         price,
    //     });
    
    //     newProduct.save();
    
    //     return res.status(201).send(newProduct);
    // });

    app.post('/product/create', isAuthenticated, controller.create);


    app.post('/product/buy', isAuthenticated, controller.buy);
    
    // app.post('/product/buy', isAuthenticated, async (req, res) => {
    //     const {ids} = req.body;
    //     const products = await Product.find({_id: {$in: ids}});
    
    //     channel.sendToQueue("ORDER-SERVICE", Buffer.from(
    //         JSON.stringify({
    //                 products,
    //                 userEmail: req.user.email,
    //             })
    //             )
    //         );
    //     channel.consume("PRODUCT-SERVICE", (data) => {
    //         console.log("Consuming PRODUCT-SERVICE queue");
    //         order = JSON.parse(data.content);
    //         channel.ack(data);
    //     });
    //     return res.status(201).send(order);
    // });
    
}