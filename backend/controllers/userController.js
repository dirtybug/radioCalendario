const user  = require('../models/user');
const bcrypt = require('bcrypt');


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
        if (!userInfo) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const validPassword = await bcrypt.compare(password, userInfo.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        req.session.userId = userInfo.id;
        res.json({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
};

// Logout do usuário via API
const userLogout = (req, res) => {

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer logout' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: 'Logout bem-sucedido' });
    });

};
// Endpoint to check if the user is logged in
const userIsLogedin = (req, res) => {
    if (req.session && req.session.userId) {
        res.status(200).json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.status(200).json({ loggedIn: false });
    }
};

// Add the isLoggedIn function to exports
module.exports = { userRegister, userLogin, userLogout, userIsLogedin };





