const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
        name: String,
        email: {type: String, unique: true},
        password: String,
        registrationTime: String,
        status: String,
    }, 
    {
        collection: 'UserData'
    }
)

mongoose.model('UserData', UserModel);
