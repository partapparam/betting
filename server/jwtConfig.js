const fs = require('fs');
const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./jwtRS256.key.pub');
module.exports = { RSA_PRIVATE_KEY, RSA_PUBLIC_KEY };

