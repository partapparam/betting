const mongoose = require('mongoose')
const challengesSchema = new mongoose.Schema({
//    TODO
    participants: [Number],
    description: String,
    created_on: Date,
    due_date: Date,
    winner_user_id: Number,
    challenge_id: Number,
    location: {
        search: String,
        Coordinates: {
            lng: Number,
            lat: Number
        }
    }
})

const Challenge = mongoose.model('Challenge', challengesSchema)
module.exports = Challenge