const  event = require('../models/event'); // Importa o modelo corretamente

// Criar evento
const createEvent = async (req, res) => {
    const { name, type, mode, frequency, dmrChannel, date, entity, description } = req.body;
    try {
        
         await event.addEvent({ name, type, mode, frequency, dmrChannel, date, entity, description });
        res.status(201).json({ message: 'Erro ao criar evento' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar evento', error });
    }
};

// Listar todos os eventos
const getAllEvents = async (req, res) => {
    try {
        const events = await event.showAllEvents();
        if (events.length === 0) {
            // Se não houver eventos, retorna um array vazio
            res.status(200).json([]);
        } else {
            // Se houver eventos, retorna os eventos
            res.status(200).json(events);
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar eventos', error });
    }
};


module.exports = { createEvent, getAllEvents };
