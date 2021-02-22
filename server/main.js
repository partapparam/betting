const express = require('express');
const port = process.env.port || 3000;
//TODO
const morgan = require('morgan');
const cors = require('cors')
const { credentials } = require('./config');

//create app
const app = express();

//setup Postgres
require('./db/pg')

//configurations
app.use(cors())
//for application/json
app.use(express.json());
//for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


require('./routes')(app)
//create the 404 and server error middleware handlers
app.use((req, res) => res.json({message: 'Error - 404', data: 'Not Found'}))
app.use((err, req, res, next) => res.json({message: 'Error - 500', data: 'Server Error'}))
//TODO - fix responses to status, add unautorized 401 method
//start server function
function startServer(port) {
    app.listen(port, () => {
        console.log(`Listening on ${port}`);
    })
}

if (require.main === module) {
    startServer(port)
} else {
    module.exports = startServer
}

//TODO
//eslint
//testing
//morgan/logging