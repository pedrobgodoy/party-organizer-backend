const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const User = require('../models/User.js');
const {parseHeaderAuthorization, validateEmail} = require('../utils/Utils.js');

module.exports = {
    async login(req, res){
        const [email, password] = parseHeaderAuthorization(req.headers);

        const emailLower = email.toLowerCase();

        const user = await User.findOne({ email: emailLower }).select(['password', 'name', 'email', 'location']);
        
        if(!user){
            return res.json({ response: "Usuário não encontrado!" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.json({ reponse: "Senha inválida!" });
        }

        const token = jwt.sign({name: user.name, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: '1 day'
        });

        return res.json({
            user: {
                name: user.name, 
                email: user.email, 
                location: user.location
            },
            token
        });
    },
    async register(req, res){
        const { name, email, password, adm } = req.body;

        const emailLower = email.toLowerCase();
        const nameFormated = name.trim();

        if(!validateEmail(emailLower)){
            return res.json({response: "Email inválido!"});
        }

        let user = await User.findOne({email: emailLower});

        if(user){
            return res.json({response: "Usuário já existe!"});
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS)).catch(err => console.log(err));
        const hashedPassword = await bcrypt.hash(password, salt).catch(err => console.log(err));

        user = await User.create({
            name: nameFormated,
            email: emailLower,
            password: hashedPassword
        })

        if(!user){
            return res.json({response: "Erro ao criar usuário!"});    
        }

        const token = jwt.sign({name: user.name, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: '1 day'
        });

        const returnUser = {
            name: user.name,
            email: user.email,
            location: user.location
        }

        return res.json({returnUser, token});
    }
}