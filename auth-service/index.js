const express = require('express');
const cors = require('cors');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(express.json());

app.use(cors());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/auth-service', 
{ 
    useNewUrlParser: true, useUnifiedTopology: true 
}, 
() => { console.log('Connected to MongoDB'); 
});


app.get("/", (req, res) => {
    res.status(200).send("welcome to auth-service");
})
//Login

app.post("/auth/login", async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).send("User not found");
    }

    var isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).send("Invalid password");
    }

    const payload = {
        email,
        name: user.name,
    }
    const token = jwt.sign(payload, "secretkey", (err, token) => {
        if(err) throw err;
        return res.json({token: token});
    });     
})

//register
app.post('/auth/register',  async(req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).send({ error: 'User already exists' });
    }
    
    // const user = await User.create({ name, email, password: bcrypt.hashSync(password, 10) });

    const newUser = await new User({
        email,
        name,
        password: bcrypt.hashSync(password, 10),
    });

    newUser.save();

    return res.status(201).send(newUser)
});

app.listen(PORT, () => {
  console.log(`Auth-Service listening on port ${PORT}`);
});
