const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const User = require("../models/User.js");
const {
    parseHeaderAuthorization,
    validateEmail,
} = require("../utils/Utils.js");

module.exports = {
    async login(req, res) {
        let email = "";
        let password = "";

        try {
            [email, password] = parseHeaderAuthorization(req.headers);
        } catch (e) {
            return res
                .status(400)
                .json({ status: "error", message: "Dados inválidos!" });
        }

        const user = await User.findOne({ email: email.toLowerCase }).select([
            "password",
            "name",
            "email",
            "location",
        ]);

        if (!user) {
            return res.json({
                status: "error",
                message: "Usuário não encontrado!",
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.json({ status: "error", message: "Senha incorreta!" });
        }

        const token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1 day",
            }
        );

        return res.json({
            status: "success",
            user: {
                name: user.name,
                email: user.email,
                location: user.location,
            },
            token,
        });
    },
    async register(req, res) {
        const { name, email, password } = req.body;

        if (!email) {
            return res.status(200).json({
                status: "error",
                message: "É necessário um email para prosseguir!",
            });
        }

        if (!password) {
            return res.status(200).json({
                status: "error",
                message: "É necessário uma senha para prosseguir!",
            });
        }

        if (!name) {
            return res.status(200).json({
                status: "error",
                message: "É necessário um nome para prosseguir!",
            });
        }

        const emailLower = email.toLowerCase();
        const nameFormated = name.trim();

        if (!validateEmail(emailLower)) {
            return res
                .status(200)
                .json({ status: "error", message: "Email inválido!" });
        }

        let user = await User.findOne({ email: emailLower });

        if (user) {
            return res
                .status(200)
                .json({ status: "error", message: "Usuário já existe!" });
        }

        if (password.length <= 3) {
            return res.status(200).json({
                status: "error",
                message: "A senha deve conter mais de 3!",
            });
        }

        const salt = await bcrypt
            .genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS))
            .catch((err) => console.log(err));
        const hashedPassword = await bcrypt
            .hash(password, salt)
            .catch((err) => console.log(err));

        user = await User.create({
            name: nameFormated,
            email: emailLower,
            password: hashedPassword,
        });

        if (!user) {
            return res
                .status(200)
                .json({ status: "error", message: "Erro ao criar usuário!" });
        }

        const token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1 day",
            }
        );

        const returnUser = {
            name: user.name,
            email: user.email,
            location: user.location,
        };

        return res.status(200).json({ status: "success", returnUser, token });
    },
};
