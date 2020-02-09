const User = require('../models/User.js');

module.exports = {
    async index(request, response){
        const users = await User.find();

        return response.json(users);
    }
}