const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User.js');

module.exports = async function auth(req, res, next){
    const [tokenType, token] = req.headers.authorization.split(' ');

    if(tokenType !== "Bearer"){
        return res.json({response: "Tipo de Token inválido!"});
    }

    if(!token){
        return res.json({response: "Token não econtrado!"});
    }

    let email = "";
    
    jwt.verify(token, process.env.JWT_SECRET, (err, value)  => {
        if(err){
            if(err.name === "JsonWebTokenError"){
                return res.json({response: "Token inválido!"});
            }
        }
        if(value){
            email = value;
        }
    })

    const user = User.findOne({email});
    
    req.auth = user;
    next();
}