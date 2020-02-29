const User = require('../models/User.js');

module.exports = {
    async update(req, res){
        const id = req.params.id;

        const user = await User.findById(id);

        user.adm = true;

        user.save();

        return res.status(200).json({response: "Permissão consedida com sucesso!"});
    }
}