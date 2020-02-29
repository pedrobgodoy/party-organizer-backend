const User = require('../models/User.js');

module.exports = {
    async index(req, res){
        const paramId = req.params.id;
        let searchId = req.auth.id;

        if(paramId){
            searchId = paramId;
        }

        const user = await User.findById(searchId);
        
        if(user){
            return res.json(user);
        }else{
            return res.json({response: "Usuário não encontrado!"});
        }
    },
    async update(req, res){
        const {name, latitude, longitude} = req.body;

        const user = await User.findById(req.auth._id);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        user.name = name;
        if(latitude && longitude) user.location = location;
        
        user.save();

        return res.json(user);
    },
    async delete(req, res){
        const deletedUser = await User.findByIdAndDelete(req.auth._id).select(['name', 'email', 'location']);

        return res.json(deletedUser);
    }
}