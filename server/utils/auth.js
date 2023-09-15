const JWT = require('jsonwebtoken')

// route protection token based
exports.requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.existUser = decode
        next()
    } catch (error) {
        console.log(error)
    }
}