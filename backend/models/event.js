
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Event {
    constructor() {

        this.eventModel = sequelize.define('Event', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('online', 'presencial', 'no_ar'),
                allowNull: false,
            },
            mode: {
                type: DataTypes.ENUM('ssb', 'fm', 'dmr'),
            },
            frequency: {
                type: DataTypes.STRING,
            },
            dmrChannel: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            entity: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
        });
    }
        // Método para adicionar um novo evento
        async addEvent(eventData) {
            try {
                const event = await this.eventModel.create(eventData);
                console.log('Evento criado com sucesso:', event);
            } catch (error) {
                console.error('Erro ao criar evento:', error);
            }
        }
    
        // Método para listar todos os eventos
        async showAllEvents() {
            try {
                const events = await this.eventModel.findAll();
                return events;
            } catch (error) {
                console.error('Erro ao listar eventos:', error);
            }
        }
}
const event = new Event();
module.exports = event;

