const user  = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar novo usuário via API
const userRegister = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user.addUser(email, password); // Chama a função para criar o usuário
        res.status(201).json({ message: 'Usuário registrado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
};

// Login do usuário via API
const userLogin = async (req, res) => {
    const { email, password } = req.body; // Usar email para login
    try {
        const userInfo = await user.findUserByEmail( email );
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const validPassword = await bcrypt.compare(password, userInfo.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
};

// Logout do usuário via API
const userLogout = (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]; // Obtém o token do cabeçalho Authorization
    if (!token) {
        return res.status(400).json({ message: 'Token não fornecido' });
    }

    res.status(200).json({ message: 'Logout realizado com sucesso' });
};



module.exports = { userRegister, userLogin, userLogout };


