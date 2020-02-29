const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User.js');

module.exports = async function auth(req, res, next){
    // TODO Validar se existe token
    const authorization = req.headers.authorization;

    if(!authorization || authorization.length == 0){
        return res.status(400).json({response: "Nenhum token encontrado!"});
    }

    const [tokenType, token] = req.headers.authorization.split(' ');

    if(tokenType !== "Bearer"){
        return res.status(400).json({response: "Tipo de Token inválido!"});
    }

    if(!token){
        return res.status(400).json({response: "Token não econtrado!"});
    }

    jwt.verify(token, process.env.JWT_SECRET, async (jwtCotent) => {
        if(jwtCotent.name != null && jwtCotent.name == "JsonWebTokenError"){
            return res.status(400).json({response: "Token inválido!"});
        }
    });

    const user = await User.findOne({email: jwtCotent.email});

    if(!user){
        return res.status(400).json({response: "Usuário Logado Inválido!"});
    }

    req.auth = user;
    next();
}