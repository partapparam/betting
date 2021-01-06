const mongoose = require('mongoose')
const betsSchema = new mongoose.Schema({
    bet_id: Number,
    challenge_id: Number,
    bet_open: Boolean,
    bet_expired: Boolean,
    public_bet: Boolean,
    bet_owner_id: Number,
    bettor_user_id: Number,
    amount: Number,
})

const Bet = mongoose.model('Bet', betsSchema)
module.exports = Bet