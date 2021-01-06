const mongoose = require('mongoose')
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    id: Number,
})

const User = mongoose.model('User', usersSchema)
module.exports = User