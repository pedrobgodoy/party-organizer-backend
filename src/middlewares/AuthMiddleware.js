const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User.js');

module.exports = async function auth(req, res, next){
    // TODO Validar se existe token
    const authorization = req.headers.authorization;

    if(!authorization || authorization.length == 0){
        return res.status(200).json({status:"error", message: "Nenhum token encontrado!"});
    }

    const [tokenType, token] = req.headers.authorization.split(' ');

    if(tokenType !== "Bearer"){
        return res.status(200).json({status:"error", message: "Tipo de Token inválido!"});
    }

    if(!token){
        return res.status(200).json({status:"error", message: "Token não econtrado!"});
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err)
            return res.status(200).json({status:"error", message: "Erro na autenticação!"});

        const user = await User.findOne({email: decoded.email});

        if(!user){
            return res.status(200).json({status:"error", message: "Usuário Logado Inválido!"});
        }
    
        req.auth = user;
        next();
    });
}