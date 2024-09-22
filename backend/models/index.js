const sequelize  = require('../config/database'); // Conecta com o arquivo de configuração do banco de dados
const event  = require('./event'); // Importa o modelo de eventos
const  user  = require('./user'); // Importa o modelo de usuário

module.exports = { sequelize, event, user };