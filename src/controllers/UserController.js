const User = require('../models/User.js');

module.exports = {
    async index(req, res){
        const { id } = req.query;

        const user = await User.findById(id);
        
        if(user){
            return res.json(user);
        }else{
            return res.json({response: "Usuário não encontrado!"});
        }
    }
}