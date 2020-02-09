const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User.js');

module.exports = async function auth(req, res, next){
    // TODO Validar se existe token

    const [tokenType, token] = req.headers.authorization.split(' ');

    if(tokenType !== "Bearer"){
        return res.json({response: "Tipo de Token inválido!"});
    }

    if(!token){
        return res.json({response: "Token não econtrado!"});
    }

    const jwtCotent = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({email: jwtCotent.email});
    
    if(!user){
        return res.json({response: "Usuário Logado Inválido!"});
    }

    console.log(user);

    req.auth = user;
    next();
}