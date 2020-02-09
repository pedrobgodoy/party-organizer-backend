const User = require('../models/User.js');

module.exports = {
    async update(req, res){
        const {_id, name, email} = req.body;

        const user = await User.findById(_id);

        if(!user){
            return res.json({response: "Usuário não encontrado!"});
        }

        user.name = name;
        user.email = email;

        user.save();

        return res.json(user);
    }
}