const express = require('express');
const port = process.env.port || 3000;
const expressSession = require('express-session');
//TODO
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const { credentials } = require('./config');

//create app
const app = express();

//setup Postgres
require('./db/pg')

//configurations
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.sessionSecret
}));

require('./routes')(app)

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