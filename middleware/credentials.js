const allowedOrigins = require('../config/allowedOrigiins')

const credentials = (req,res,next)=>{
    const origin = req.headers.origin
    if(allowedOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', true)
    }
    next()
}

module.exports = credentials