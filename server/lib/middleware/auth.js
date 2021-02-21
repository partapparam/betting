const expressJwt = require('express-jwt');
const { RSA_PUBLIC_KEY } = require('../../jwtConfig');
const checkIfAuth = expressJwt({
    algorithms: ['RS256'],
    secret: RSA_PUBLIC_KEY
});

module.exports = checkIfAuth;