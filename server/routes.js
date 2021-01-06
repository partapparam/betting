const handler = require('./lib/handlers')

module.exports = app => {
    app.get('/api/home', handler.home)
}