
const { DataTypes } = require('sequelize');
const { sequelizeUsers, sequelizeEvents } = require('../config/database');


class Event {
    constructor() {
        this.eventModel = sequelizeEvents.define('Event', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
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
            enddate: {
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
        this.eventModel.sync()
        .then(() => console.log('eventModel table synchronized successfully.'))
        .catch((error) => console.error('Error synchronizing eventModel table:', error));
    }

    // Method to add a new event
    async addEvent(eventData) {
        try {
            const event = await this.eventModel.create(eventData);
            console.log('Evento criado com sucesso:', event);
        } catch (error) {
            console.error('Erro ao criar evento:', error);
        }
    }

    // Method to list all events
    async showAllEvents() {
        try {
            const events = await this.eventModel.findAll();
            return events;
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
        }
    }

    // Method to delete an event by ID
    async deleteEventById(id) {
        try {
            const result = await this.eventModel.destroy({
                where: { id }
            });
            if (result === 0) {
                console.log('Evento não encontrado para exclusão.');
                return false;
            }
            console.log('Evento excluído com sucesso.');
            return true;
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            throw error;
        }
    }
}

const event = new Event();
module.exports = event;
