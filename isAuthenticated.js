const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, next) {

    if(!req.headers["authorization"]) {
        return res.status(401).send('Header authorization is required');
    }

    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {  
            return res.status(401).send({ error: 'You are not authorized' }); 
        }
        req.user = decoded;
        next();
    })
}
