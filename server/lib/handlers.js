const db = require('../db/pg');
const jwt = require('jsonwebtoken');
const { RSA_PRIVATE_KEY } = require('./../jwtConfig');
const createToken = user => {
    return jwt.sign({id: user.id}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 120000,
        subject: 'Auth ID'
    });
};
// TODO - bring in lodash to convert to camelCase
exports.home = (req, res) => {
    let query = 'SELECT challenger_user_id, creator_user_id, challenge_id, name, description, created_on, event_date, location_search, first_name, last_name, id ' +
        'FROM challenges ' +
        'LEFT JOIN users ' +
        'ON challenges.creator_user_id = users.id';

    db.query(query)
        .then(response => {
            res.json(response.rows)
        })
        .catch(err => {
            console.log('error', err)
            res.json({ status: 'fail', data: err})
        })
}

exports.getChallenge = (req, res) => {
    console.log('got request');
    let challengeId = req.query.id;
    let data = {}
    let query = `SELECT * 
    FROM challenges
    LEFT JOIN users ON challenges.creator_user_id = users.id
    WHERE challenge_id = $1
    `;
    let challengerQuery = `SELECT * FROM users WHERE users.id = $1`
    let betsQuery = `SELECT * FROM bets where bet_challenge_id = $1`
    db.getClient()
        .then(client => {
            console.log('got client');
            client.query(query, [challengeId])
                .then(response => {
                    response = response.rows[0]
                    data = {
                        challenge_id: response.challenge_id,
                        description: response.description,
                        challenger_user_id: response.challenger_user_id,
                        creator_first_name: response.first_name,
                        creator_last_name: response.last_name,
                        challenger_first_name: null,
                        challenger_last_name: null,
                        created_on: response.created_on,
                        event_date: response.event_date,
                        location_search: response.location_search,
                        bets: {}
                    }
                    console.log('step one')
                    return data.challenger_user_id
                })
                .then(async id => {
                    console.log('step 2');
                    return await Promise.all([
                        client.query(challengerQuery, [id]),
                        client.query(betsQuery, [challengeId])
                        ])
                })
                .then(response => {
                    let userResponse = response[0].rows[0]
                    let betResponse = response[1].rows
                    data.challenger_first_name = userResponse.first_name;
                    data.challenger_last_name = userResponse.last_name;
                    data.bets = betResponse;
                    console.log('step 3')
                    res.json(data);
                })
                .catch(err => {
                    console.log('ERRoR: ' + err)
                    res.json({status: 'error', data: 'ERROR'})
                })
                //release the client back to the pool
                .finally(() => client.release())
    })
}

exports.newChallenge = (req, res) => {
    let body = req.body;
    let query = `INSERT INTO challenges (creator_user_id, description, created_on, event_date, location_search) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
    db.query(query, [body.id, body.description, new Date(), new Date(), body.location_search])
        .then(response => {
            res.json({
                message: 'success',
                data: response.rows[0]
            })
        })
        .catch(err => {
            console.log('ErroR:' + err)
            res.json({
                message: 'error'
            })
        })
}

exports.newBet = (req, res) => {
    let challengeId = req.params.id;
    let body = req.body;
    let values = [challengeId, 1, body.id, body.amount]
    let query = `INSERT INTO bets (bet_challenge_id, bet_open, bet_owner_user_id, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    db.query(query, values)
        .then(response => {
            res.json({
                message: 'success',
                data: response.rows
            })
        })
        .catch(err => {
            console.log('Error' + err)
            res.json({
                message: 'Error'
            })
        })
}

//TEST HANDLERS
exports.testUsers = (req, res) => {
    let query = 'SELECT * FROM users'
    db.query(query)
        .then(response => {
            res.json({
                data: response.rows
            })
        })
        .catch(err => {
            console.log('ERROR' + err)
            res.json({message: 'error'})
        })
}

exports.testChallenges = (req, res) => {
    let query = 'SELECT * FROM challenges'
    db.query(query)
        .then(response => {
            res.json({ data: response.rows })
        })
        .catch(err => {
            console.log('ERROR' + err)
            res.json({ message: 'error' })
        })
}

exports.testBets = (req, res) => {
    let query = 'SELECT * FROM bets'
    db.query(query)
        .then(response => {
            res.json({
                message: 'success',
                data: response.rows
            })
        })
        .catch(err => {
            console.log('ERROR' + err)
            res.json({message: 'ErroR'})
        })
}




