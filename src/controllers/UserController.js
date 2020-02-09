const User = require('../models/User.js');

module.exports = {
    async index(request, response){
        const { id } = request.query;

        const user = await User.findById(id);
        
        if(user){
            return response.json(user);
        }else{
            return response.json({message: "Usuário não encontrado!"});
        }
    },
    async store(request, response){
        const { name, email, password } = request.body;

        let user = await User.findOne({email});

        if(!user){
            user = await User.create({
                name,
                email,
                password
            })

            return response.json(user);
        }else{  
            return response.json({message: "Usuário já existe!"});
        }
    }
}