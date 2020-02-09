const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next){
    if(req.query.teste){
        next()
    }else{
        return res.json({ message: "Erro na autenticação" })
    }
}