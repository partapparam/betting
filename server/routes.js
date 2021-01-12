const handler = require('./lib/handlers')

module.exports = app => {
    app.get('/api/home', handler.home);
    app.get('/api/challenge/:id', handler.getChallenge);
    app.post('/api/challenge/new', handler.newChallenge);
    app.post('/api/challenge/:id/bet/new', handler.newBet)
    app.get('/test/u', handler.testUsers)
    app.get('/test/c', handler.testChallenges)
    app.get('/test/b', handler.testBets)

}