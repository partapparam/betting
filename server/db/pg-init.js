//create db using pg client
const { Client } = require('pg')
const { credentials } = require('../config')
const { connectionString } = credentials.postgres
const client = new Client({connectionString})

const createScript = `
CREATE TABLE IF NOT EXISTS users(
first_name VARCHAR(30) NOT NULL,
id SERIAL PRIMARY KEY,
last_name VARCHAR(30) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges(
challenger_user_id INT NULL,
creator_user_id INT NOT NULL,
challenge_id SERIAL PRIMARY KEY,
description TEXT NULL,
created_on TIMESTAMPTZ NOT NULL,
event_date TIMESTAMPTZ NOT NULL,
winner_user_id INT NULL,
location_search VARCHAR(200) NOT NULL,
location_lng INT NULL,
location_lat INT NULL,
FOREIGN KEY (creator_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bets (
bet_id SERIAL PRIMARY KEY,
bet_challenge_id INT NOT NULL,
bet_open BIT NOT NULL,
bet_owner_user_id INT NOT NULL,
bettor_user_id INT NULL,
amount INT NOT NULL,
FOREIGN KEY (bet_challenge_id) REFERENCES challenges(challenge_id)
);
`;

const seedUsers = async client => {
    let query = `
    INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);
    `
    let p1 = client.query(query, ['param', 'singh', '1@test.com', 'asd'])
    let p2 = client.query(query, ['justin', 'smith', '2@test.com', 'asd'])
    let p3 = client.query(query, ['harry', 'yadav', '3@test.com', 'asd'])

    await Promise.all([p1, p2, p3])
}

const seedBets = async client => {
    let query = `INSERT INTO bets (bet_challenge_id, bet_open, bet_owner_user_id, bettor_user_id, amount) VALUES ($1, $2, $3, $4, $5)`;
    let p1 = client.query(query, [ 1, 1, 1, 2, 30])
    let p2 = client.query(query, [ 1, 0, 1, 3, 20])
    let p3 = client.query(query, [ 2, 1, 2, 1, 50])
    let p4 = client.query(query, [ 2, 0, 1, 3, 100])

    await Promise.all([p1, p2, p3, p4])
}

const seedChallenges = async client => {
    let query = `INSERT INTO challenges (creator_user_id, challenger_user_id, description, created_on, event_date, location_search) VALUES ($1, $2, $3, $4, $5, $6)`;
    let p1 = client.query(query, [1, 2, 'Test Descrpition one', new Date(), new Date(), 'Los Angeles, CA'])
    let p2 = client.query(query, [2, 3, 'Test Descrpition two', new Date(), new Date(), 'Tuscon, AZ'])
    await Promise.all([p1, p2])
}

client.connect().then(async () => {
    try {
        console.log('creating scripts')
        await Promise.all([
            client.query('DROP TABLE IF EXISTS bets'),
            client.query('DROP TABLE IF EXISTS challenges'),
            client.query('DROP TABLE IF EXISTS users')
        ])
        await client.query(createScript)
        await seedUsers(client)
        await seedChallenges(client)
        await seedBets(client)
    } catch (err) {
        console.error('error', err)
    } finally {
        client.end()
    }
})