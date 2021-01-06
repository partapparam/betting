const mongoose = require('mongoose');
const { credentials } = require('./config');
const { connectionString } = credentials.mongo;
const Bet = require('./models/bet')
const Challenge = require('./models/challenge')
const User = require('./models/user')


//make sure there is a connection string
if (!connectionString) {
    console.log('unable to connect to mongodb');
    process.exit(1);
}
//create connection
mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => {
    console.log('mongodb 14 error');
    process.exit(1);
});
db.once('open', () => {
    console.log('MongoDB is connected');
});

//seed DB
Bet.find({}, (err, bets) => {
    if (err) {
        console.log(err, 'DB 33')
        return err;
    }
    if (bets.length) {
        return
    }

    new Bet({
        bet_id: 1,
        challenge_id: 1,
        bet_open: true,
        bet_expired: false,
        public_bet: true,
        bet_owner_id: 1,
        bettor_user_id: 2,
        amount: 100
    }).save()

    new Bet({
        bet_id: 2,
        challenge_id: 1,
        bet_open: true,
        bet_expired: false,
        public_bet: true,
        bet_owner_id: 1,
        bettor_user_id: 2,
        amount: 200
    }).save()

    new Bet({
        bet_id: 3,
        challenge_id: 2,
        bet_open: true,
        bet_expired: true,
        public_bet: false,
        bet_owner_id: 1,
        bettor_user_id: 2,
        amount: 300
    }).save()
})
//seed challenges
Challenge.find({}, (err, challenges) => {
    if (err) {
        console.log(err)
        return
    }
    if (challenges.length) {
        return
    }

    new Challenge({
        participants: [1, 2],
        description: 'Running race',
        created_on: Date.now(),
        due_date: Date.now() + 1000000,
        winner_user_id: 1,
        challenge_id: 2,
        location: {
            search: 'Los Angeles, CA'
        }
    }).save()

    new Challenge({
        participants: [1, 2],
        description: 'Walking race',
        created_on: Date.now(),
        due_date: Date.now() + 100123000,
        winner_user_id: null,
        challenge_id: 1,
        location: {
            search: 'Long Beach, CA'
        }
    }).save()

    new Challenge({
        participants: [1, 2],
        description: 'Running race',
        created_on: Date.now(),
        due_date: Date.now() + 1000000,
        winner_user_id: 1,
        challenge_id: 2,
        location: {
            search: 'Los Angeles, CA'
        }
    }).save()
})
//seed users
User.find((err, users) => {
    if (err) {
        console.log(err)
        return
    }
    if (users.length) return

    new User({
        first_name: 'Param',
        last_name: 'Singh',
        id: 1,
    }).save()

    new User({
        first_name: 'Justin',
        last_name: 'Smith',
        id: 2,
    }).save()
})

//create DB api abstraction layer
module.exports = {
    getUsers: async (options = {}) => User.find(options),
    getBets: async (options = {}) => Bet.find(options),
    getChallenges: async (options = {}) => Challenge.find(options)
}
