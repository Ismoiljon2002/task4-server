const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "JDHFArjhar8298yr(*Q9HFHOQ8isdjnoireqo8h+45+99/*-+.5+9da}{";
const MongoClient = require('mongodb').MongoClient;
const recordRoutes = express.Router();


app.use(cors())
app.use(express.json());
const mongoURL = "mongodb+srv://ismoiljon:ismoiljondebyoz@cluster0.6u7qcuz.mongodb.net/?retryWrites=true&w=majority"

var database;

mongoose
    .connect(mongoURL)
    .then((req, res) => {
        console.log("connected to database")
    })
    .catch(e => console.log(e));

require("./models/user.model");
const User = mongoose.model("UserData");
const date = new Date();



app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.send({ error: "User Exists" })
        } else {
            await User.create({
                name,
                email,
                password: encryptedPassword,
                registrationTime: date,
                status: "Active",
            });
            res.send({ status: "OK", });
        }
    } catch (error) {
        res.send({ status: 'error' });
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const currentUser = await User.findOne({ email });

    if (!currentUser) return res.send({ error: "User Not Found" });
    const decryptedPassword = await bcrypt.compare(password, currentUser.password);
    if (decryptedPassword) {
        const token = jwt.sign({ email: currentUser.email }, JWT_SECRET);
        if (res.status(201))
            return res.send({ status: "OK", data: token })
        else
            return res.send({ error: "error" });
    }
    res.send({ status: "error", error: "Invalid password" })

})

app.get(("/userData"), async (req, res) => {
    await User.find({}).then( (users) => {
        res.send(users);  
    });
})

app.post('/findUser', (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        User.findOne({ email: user.email })
            .then(data => { res.send({ status: "OK", data: data }) })
            .catch(err => {
                res.send({ status: "error", data: err })
            })
    } catch (error) {

    }
})


app.listen(1879, () => {
    // MongoClient.connect('mongodb://localhost:2017', 
    // {useNewUrlParse: true},
    // (error, result) => {
    //     if(error) throw error;
    //     database = result.db("task4");
    //     console.log("connected to db")
    // })
    console.log("server started");
})