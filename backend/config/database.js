
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelizeUsers = new Sequelize({
  dialect: 'sqlite',
  storage: 'UserDB.sqlite'
});

const sequelizeEvents = new Sequelize({
  dialect: 'sqlite',
  storage: 'EventDB.sqlite'
});


module.exports = { sequelizeUsers,sequelizeEvents };
