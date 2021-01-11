const db = require('../db/pg')

exports.home = (req, res) => {
    let data = []
    let query = 'SELECT * FROM vacations';
    let values = []
    db.query(query, values)
        .then(response => {
            console.log('success')
            data = response.rows
            res.status(200).json({
                message: 'success',
                data: data
            })
        })
        .catch(err => {
            console.log('error', err)
            res.json({ message: 'fail' })
        })
}
exports.test = (req, res) => {
    let query = 'SELECT * FROM vacations'
    db.getClient()
        .then(client => {
            client.query(query)
                .then(response => {
                    console.log('success')
                    res.json({message: response.rows[0]})
                })
                .catch(err => {
                    console.log('err', err)
                    res.json({message: 'error'})
                })
                //this step is VITAL -- we must return the client we checkout
                .finally(() => client.release())
        })
}


