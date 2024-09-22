const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');


class User {
    constructor() {
        this.User = sequelize.define('User', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Email será o identificador único
                validate: {
                    isEmail: true, // Validação de formato de email
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });
    }

    // Método para adicionar um usuário (usado tanto pelo comando quanto pela API)
    async addUser(email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
            const user = await this.User.create({ email, password: hashedPassword }); // Cria o usuário
            console.log('Usuário criado com sucesso:', user);
            return user;
        } catch (error) {
            console.error('Erro ao criar o usuário:', error);
            throw error;
        }
    }

    // Outro método para, por exemplo, buscar um usuário pelo email
    async findUserByEmail(email) {
        try {
            const user = await this.User.findOne({ where: { email } });
            return user;
        } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
            throw error;
        }
    }
    async showAllUsers() {
        try {
            const users = await this.User.findAll(); // Busca todos os usuários
            if (users.length > 0) {
                console.log('Lista de usuários:');
                users.forEach((user) => {
                    console.log(`- ${user.email}`);
                });
            } else {
                console.log('Nenhum usuário encontrado.');
            }
            return users;
        } catch (error) {
            console.error('Erro ao buscar todos os usuários:', error);
            throw error;
        }
    }
}
const user = new User();
module.exports = user;

