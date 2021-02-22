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
    const query = 'SELECT * FROM users WHERE users.email = $1';
    return db.query(query, [email]);
};

exports.signup = (req, res) => {
    const query = `INSERT INTO users(email, first_name, last_name, password) VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const {firstName, lastName, email, password} = req.body;
    if (!firstName) return res.json({status: 'error', data: 'Invalid form'});
    db.query(query, [email, firstName, lastName, password])
        .then(response => {
            const { rows } = response;
            if (rows[0]) {
                const user = rows[0];
                const data = {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    token: createToken(user.id)
                };
                return res.json({status: 'success', data: data, expiresIn: 120000});
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
        .then(response => {
            const { rows } = response
            if (rows[0]) {
                const user = rows[0];
                const data = {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    token: createToken(user.id)
                };
                console.log(data);
                return res.json({status: 'success', data: data, expiresIn: 120000});
            }
        })
        .catch(err => {
            console.log(err);
            return res.json({status: 'error', data: err});
        })
}
