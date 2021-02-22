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
const validate = email => {
    const query = 'SELECT * FROM users WHERE email.id = $1';
    return db.query(query, [email]);
};

exports.signup = (req, res) => {
    const query = 'INSERT INTO users(first_name, last_name) VALUES $1, $2';
    const {firstName, lastName} = req.body;
    if (!firstName) return res.json({status: 'error', data: 'Invalid form'});
    db.query(query, [firstName, lastName])
        .then(user => {
            if (user) {
                const token = createToken(user.id);
                return res.json({status: 'success', data: token, expiresIn: 120000});
            }
            return res.json({status: 'error', data: 'Could not create user'});
        })
        .catch(err => {
            console.log(err);
            return res.json({status: 'error', data: err});
        })
}
exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.json({status: 'error', data: 'Invalid email'});
    validate(email)
        .then(user => {
            if (user) {
                const token = createToken(user.id);
                return res.json({status: 'success', data: token, expiresIn: 120000});
            }
        })
        .catch(err => {
            console.log(err);
            return res.json({status: 'error', data: err});
        })
}
