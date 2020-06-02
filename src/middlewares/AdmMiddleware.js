const User = require('../models/User.js');

module.exports = async function checkAdm(req, res, next){
    const user = await User.findOne({email: req.auth.email});

    if(!user.adm){
        return res.status(403).send({response: "Usuário não tem permissão para continuar!"});
    }
    
    next()
}