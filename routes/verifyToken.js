const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Доступ запрещен')

    try {
        const verified = jwt.verify(token, config.secret, {algorithms: 'HS256'})
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send(error.message)
    }
}