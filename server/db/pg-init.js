//create db using pg client
const { Client } = require('pg')
const { credentials } = require('../config')
const { connectionString } = credentials.postgres
const client = new Client({connectionString})

const createScript = `
CREATE TABLE IF NOT EXISTS users
name varchar(30) NOT NULL,
id varchar(20) NOT NULL,
email varchar(200) NOT NULL;
`

client.connect().then(async () => {
    try {
        console.log('creating scripts')
        await client.query(createScript)
    } catch (err) {
        console.error('error', err)
    } finally {
        client.end()
    }
})