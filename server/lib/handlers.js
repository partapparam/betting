const db = require('../mongodb')

exports.home = async (req, res) => {
    let challenges = await db.getChallenges();
    let data = await Promise.all(
        challenges.map( challenge => {
            challenge.users = [];
            // challenge.participants.forEach( async participant => {
            //     let user = await db.getUsers({id: participant})
            //     challenge.users.push(user)
            // })
            return challenge;
        })
    )
    res.status(200).json({
        message: 'success',
        data: data
    })
}